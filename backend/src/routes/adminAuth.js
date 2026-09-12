const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/Admin");
const AdminBootstrap = require("../models/AdminBootstrap");
const { authLimiter } = require("../middleware/rateLimiter");
const { requireAdmin } = require("../middleware/adminAuth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

const generateAdminToken = (admin) =>
  jwt.sign(
    { id: admin._id, role: "admin", accessRole: admin.role },
    process.env.JWT_SECRET || "fallback_secret_farmy",
    { expiresIn: "8h" }
  );

// Hackathon convenience: the first account becomes super admin; later accounts are procurement officers.
// Replace this open signup with an invite/provisioning flow before a production launch.
router.post(
  "/signup",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { fullname, officialEmail, employeeId, mobileNumber, department, password } = req.body;
    if (!fullname || !officialEmail || !employeeId || !mobileNumber || !department || !password) {
      return res.status(400).json({ success: false, error: "All administrator signup fields are required." });
    }
    if (password.length < 10) return res.status(400).json({ success: false, error: "Administrator password must be at least 10 characters." });

    let bootstrap;
    let role = "procurement_officer";

    if (!(await Admin.exists({}))) {
      try {
        bootstrap = await AdminBootstrap.create({ key: "initial" });
        role = "super_admin";
      } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, error: "The first administrator signup is in progress. Please try again shortly." });
        throw error;
      }
    }

    let admin;
    try {
      admin = await Admin.create({
        fullname,
        officialEmail,
        employeeId,
        mobileNumber,
        department,
        role,
        password: await bcrypt.hash(password, 12),
      });
      if (bootstrap) {
        bootstrap.adminId = admin._id;
        await bootstrap.save();
      }
    } catch (error) {
      // Do not leave a failed first signup permanently blocking the super-admin role.
      if (bootstrap) await AdminBootstrap.deleteOne({ _id: bootstrap._id });
      throw error;
    }

    res.status(201).json({
      success: true,
      message: role === "super_admin" ? "Super administrator registered." : "Administrator registered.",
      token: generateAdminToken(admin),
      admin,
    });
  })
);

router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { officialEmail, password } = req.body;
    if (!officialEmail || !password) return res.status(400).json({ success: false, error: "Official email and password are required." });
    const admin = await Admin.findOne({ officialEmail: officialEmail.toLowerCase().trim() }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) return res.status(401).json({ success: false, error: "Invalid administrator email or password." });
    if (!admin.isActive) return res.status(403).json({ success: false, error: "This administrator account is inactive." });
    res.json({ success: true, token: generateAdminToken(admin), admin });
  })
);

router.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin.id);
    if (!admin || !admin.isActive) return res.status(404).json({ success: false, error: "Administrator account not found." });
    res.json({ success: true, admin });
  })
);

module.exports = router;
