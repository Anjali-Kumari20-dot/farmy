const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farmer = require("../models/Farmer");
const Otp = require("../models/Otp");
const verifyToken = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const asyncHandler = require("../utils/asyncHandler");
const smsService = require("../services/smsService");

const router = express.Router();

// DEVELOPMENT ONLY: lets the local UI test registration without a Twilio Verify Service.
// This is deliberately disabled in production, even if OTP_BYPASS_CODE is configured.
const getDevelopmentOtpBypassCode = () =>
  process.env.NODE_ENV !== "production" ? process.env.OTP_BYPASS_CODE : null;

/**
 * Helper to generate signed JWT token for an authenticated farmer
 */
const generateAuthToken = (farmerId) => {
  return jwt.sign(
    { id: farmerId },
    process.env.JWT_SECRET || "fallback_secret_farmy",
    { expiresIn: "7d" }
  );
};

// =========================================================================
// 1. SEND OTP
// =========================================================================
router.post(
  "/send-otp",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { mobileNumber, purpose = "registration" } = req.body;

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: "A valid 10-digit mobile number is required.",
      });
    }

    // Check if farmer already exists when attempting registration
    if (purpose === "registration") {
      const existingFarmer = await Farmer.findOne({ mobileNumber });
      if (existingFarmer) {
        return res.status(409).json({
          success: false,
          error: "A farmer with this mobile number is already registered. Please log in.",
        });
      }
    }

    // Check if farmer does NOT exist when attempting password reset
    if (purpose === "reset_password") {
      const existingFarmer = await Farmer.findOne({ mobileNumber });
      if (!existingFarmer) {
        return res.status(404).json({
          success: false,
          error: "No farmer account found with this mobile number.",
        });
      }
    }

    // Used by the local/mock provider. Twilio Verify generates its own code.
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Clear any pending OTPs for this number and purpose
    await Otp.deleteMany({ mobileNumber, purpose });

    // Store new OTP record (auto-purged by MongoDB TTL in 300 seconds)
    await Otp.create({
      mobileNumber,
      otp: generatedOtp,
      purpose,
    });

    const bypassCode = getDevelopmentOtpBypassCode();

    // DEVELOPMENT ONLY: do not call Twilio while the configured bypass code is in use.
    const smsResult = bypassCode
      ? { success: true, provider: "development-bypass" }
      : await smsService.sendOtpSms(mobileNumber, generatedOtp, purpose);

    if (!smsResult.success) {
      await Otp.deleteMany({ mobileNumber, purpose });
      return res.status(502).json({
        success: false,
        error: "Unable to send the verification SMS. Please check the SMS provider configuration and try again.",
      });
    }

    res.json({
      success: true,
      message: `OTP sent successfully to +91 ${mobileNumber}.`,
      expiresInSeconds: 300,
      smsProvider: smsResult.provider,
      // Only the local mock provider returns a generated development code.
      devOtp: smsResult.provider === "mock" ? generatedOtp : undefined,
    });
  })
);

// =========================================================================
// 2. VERIFY OTP
// =========================================================================
router.post(
  "/verify-otp",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { mobileNumber, otp, purpose = "registration" } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        error: "Both mobile number and OTP code are required.",
      });
    }

    const otpRecord = await Otp.findOne({ mobileNumber, purpose });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: "OTP has expired or was never requested. Please request a new code.",
      });
    }

    // Brute force defense: block verification after 5 failed attempts
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        error: "Maximum verification attempts exceeded. Please request a new OTP.",
      });
    }

    let verified = false;

    const bypassCode = getDevelopmentOtpBypassCode();

    // DEVELOPMENT ONLY: accept the configured local bypass code instead of calling Twilio Verify.
    if (bypassCode) {
      verified = otp.trim() === bypassCode;
    } else if (smsService.usesTwilioVerify()) {
      const verificationResult = await smsService.verifyOtp(mobileNumber, otp.trim());
      if (!verificationResult.success) {
        return res.status(502).json({
          success: false,
          error: "Unable to verify the OTP with Twilio. Please request a new code and try again.",
        });
      }
      verified = verificationResult.approved;
    } else {
      verified = otpRecord.otp === otp.trim();
    }

    if (!verified) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remainingAttempts = 5 - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        error: `Invalid OTP code. You have ${remainingAttempts} attempts remaining.`,
      });
    }

    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  })
);

// =========================================================================
// 3. REGISTER FARMER
// =========================================================================
router.post(
  "/register",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { fullname, mobileNumber, password, otp, dateOfBirth, aadhaarNumber } = req.body;

    if (!fullname || !mobileNumber || !password || !dateOfBirth || !aadhaarNumber) {
      return res.status(400).json({
        success: false,
        error: "Full name, date of birth, Aadhaar number, mobile number, and password are required.",
      });
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: "Mobile number must be exactly 10 digits.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || Number.isNaN(Date.parse(`${dateOfBirth}T00:00:00Z`))) {
      return res.status(400).json({ success: false, error: "Date of birth must be a valid date in YYYY-MM-DD format." });
    }

    // Verify OTP record
    const otpRecord = await Otp.findOne({
      mobileNumber,
      purpose: "registration",
    });

    // The OTP must have been verified through the dedicated verification endpoint.
    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({
        success: false,
        error: "Mobile number has not been verified with OTP.",
      });
    }

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ mobileNumber });
    if (existingFarmer) {
      return res.status(409).json({
        success: false,
        error: "A farmer with this mobile number is already registered.",
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const identity = Farmer.prepareIdentity(aadhaarNumber);
    const farmer = await Farmer.create({
      fullname: fullname.trim(),
      mobileNumber: mobileNumber.trim(),
      password: hashedPassword,
      dateOfBirth,
      ...identity,
    });

    // Clean up OTP record once registration succeeds
    await Otp.deleteMany({ mobileNumber, purpose: "registration" });

    // Generate JWT token
    const token = generateAuthToken(farmer._id);

    // farmer.toJSON() automatically omits password hash
    res.status(201).json({
      success: true,
      message: "Farmer registered successfully.",
      token,
      farmer,
    });
  })
);

// =========================================================================
// 4. LOGIN
// =========================================================================
router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        error: "Both mobile number and password are required.",
      });
    }

    const farmer = await Farmer.findOne({ mobileNumber });
    if (!farmer) {
      return res.status(401).json({
        success: false,
        error: "Invalid mobile number or password.",
      });
    }

    const isMatch = await farmer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid mobile number or password.",
      });
    }

    const token = generateAuthToken(farmer._id);

    // farmer.toJSON() securely excludes the password field
    res.json({
      success: true,
      message: "Welcome back! Login successful.",
      token,
      farmer,
    });
  })
);

// =========================================================================
// 5. RESET PASSWORD
// =========================================================================
router.post(
  "/reset-password",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { mobileNumber, newPassword, otp } = req.body;

    if (!mobileNumber || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Mobile number and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long.",
      });
    }

    // Verify OTP record
    const otpRecord = await Otp.findOne({
      mobileNumber,
      purpose: "reset_password",
    });

    if (!otpRecord || !otpRecord.verified) {
      return res.status(400).json({
        success: false,
        error: "OTP verification required before resetting password.",
      });
    }

    const farmer = await Farmer.findOne({ mobileNumber });
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer account not found.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    farmer.password = await bcrypt.hash(newPassword, salt);
    await farmer.save();

    // Remove used OTP
    await Otp.deleteMany({ mobileNumber, purpose: "reset_password" });

    res.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  })
);

// Allows accounts created before identity onboarding was added to complete their profile.
router.patch(
  "/identity",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { dateOfBirth, aadhaarNumber } = req.body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || Number.isNaN(Date.parse(`${dateOfBirth}T00:00:00Z`))) {
      return res.status(400).json({ success: false, error: "Date of birth must be a valid date in YYYY-MM-DD format." });
    }

    const farmer = await Farmer.findById(req.user.id);
    if (!farmer) return res.status(404).json({ success: false, error: "Farmer profile not found." });

    const identity = Farmer.prepareIdentity(aadhaarNumber);
    farmer.dateOfBirth = dateOfBirth;
    Object.assign(farmer, identity);
    await farmer.save();

    res.json({ success: true, message: "Identity profile saved.", farmer });
  })
);

// =========================================================================
// 6. GET CURRENT PROFILE (Protected)
// =========================================================================
router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req, res) => {
    const farmer = await Farmer.findById(req.user.id);
    if (!farmer) {
      return res.status(404).json({
        success: false,
        error: "Farmer profile not found.",
      });
    }

    res.json({
      success: true,
      farmer,
    });
  })
);

module.exports = router;
