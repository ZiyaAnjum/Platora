/**
 * Wraps an async Express route/middleware function so any rejected promise
 * (thrown error) is automatically forwarded to next(err), instead of
 * requiring a try/catch block in every single controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
