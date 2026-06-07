/**
 * CampusRide - Async Handler Wrapper
 * Eliminates try-catch boilerplate in controller functions
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
