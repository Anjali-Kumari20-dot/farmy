/**
 * Centralized Express error-handling middleware.
 * Formats errors, translates Mongoose validation and duplicate key codes (11000),
 * and prevents internal implementation details from leaking in production.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue || {})[0] || "field";
    if (duplicateField === "aadhaarFingerprint") {
      return res.status(409).json({
        success: false,
        error: "An account with this Aadhaar number already exists.",
        field: "aadhaarNumber",
      });
    }
    const duplicateValue = err.keyValue ? err.keyValue[duplicateField] : "";
    return res.status(409).json({
      success: false,
      error: `The ${duplicateField} '${duplicateValue}' is already registered.`,
      field: duplicateField,
    });
  }

  // Mongoose schema validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", "),
      details: messages,
    });
  }

  // CastError (invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid identifier format: ${err.value}`,
    });
  }

  // Default fallback status and response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "An unexpected server error occurred.",
  });
};

/**
 * 404 Route Not Found middleware
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
