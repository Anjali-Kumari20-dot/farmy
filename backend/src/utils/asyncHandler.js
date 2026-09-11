/**
 * Wraps async Express route handlers to automatically catch any rejected promise
 * and pass the error to the centralized Express error handling middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
