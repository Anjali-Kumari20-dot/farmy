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

    // Generate secure 4-digit OTP code (between 1000 and 9999)
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Clear any pending OTPs for this number and purpose
    await Otp.deleteMany({ mobileNumber, purpose });

    // Store new OTP record (auto-purged by MongoDB TTL in 300 seconds)
    await Otp.create({
      mobileNumber,
      otp: generatedOtp,
      purpose,
    });

    // Dispatch via pluggable SMS service (Fast2SMS / Twilio / Mock logger)
    const smsResult = await smsService.sendOtpSms(mobileNumber, generatedOtp, purpose);

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
      // In non-production/mock mode, provide devOtp for easy testing
      devOtp: process.env.NODE_ENV === "production" && smsResult.provider !== "mock" ? undefined : generatedOtp,
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

    // Check if code matches
    if (otpRecord.otp !== otp.trim()) {
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
    const { fullname, mobileNumber, password, otp } = req.body;

    if (!fullname || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        error: "Full name, mobile number, and password are required.",
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

    const farmer = await Farmer.create({
      fullname: fullname.trim(),
      mobileNumber: mobileNumber.trim(),
      password: hashedPassword,
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
