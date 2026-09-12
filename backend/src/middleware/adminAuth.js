const jwt = require("jsonwebtoken");
const { Admin } = require("../models/Admin");

const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Administrator authentication required." });
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET || "fallback_secret_farmy");
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, error: "Administrator access required." });
    }
  } catch (error) {
    return res.status(error.name === "TokenExpiredError" ? 401 : 403).json({
      success: false,
      error: error.name === "TokenExpiredError" ? "Administrator session expired." : "Invalid administrator token.",
    });
  }

  try {
    // Fetch the current account so role changes or deactivation take effect immediately.
    const admin = await Admin.findById(decoded.id).select("role isActive");
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, error: "Administrator account is inactive or no longer exists." });
    }
    req.admin = { id: admin._id.toString(), role: admin.role };
    return next();
  } catch (error) {
    return next(error);
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, error: "Your administrator role does not have this permission." });
  }
  next();
};

module.exports = { requireAdmin, requireRole };
