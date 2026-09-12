const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware
 * Validates Bearer token from the Authorization header and attaches the decoded
 * farmer identity (req.user = { id }) to the request context.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verify Bearer schema exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Bearer token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_farmy");
    if (decoded.role === "admin") {
      return res.status(403).json({ success: false, error: "Farmer authentication is required for this endpoint." });
    }
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Session expired. Please log in again.",
      });
    }

    return res.status(403).json({
      success: false,
      error: "Invalid authentication token.",
    });
  }
};

module.exports = verifyToken;
