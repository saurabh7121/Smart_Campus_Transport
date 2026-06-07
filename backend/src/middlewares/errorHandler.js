/**
 * CampusRide - Global Error Handler
 * Catches all errors and returns consistent JSON responses
 */

const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log the error
  if (process.env.NODE_ENV === 'development') {
    logger.error(`${err.message}`, { stack: err.stack, path: req.path, method: req.method });
  } else {
    logger.error(`${err.message}`, { path: req.path, method: req.method });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation error', errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

module.exports = { errorHandler, notFoundHandler };
