/**
 * CampusRide - Authentication Middleware
 * JWT verification and user injection into request
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check cookies as fallback
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw ApiError.unauthorized('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      throw ApiError.unauthorized('User not found. Token may be invalid.');
    }

    if (user.status === 'blocked') {
      throw ApiError.forbidden('Your account has been blocked. Contact admin.');
    }

    if (user.status === 'suspended') {
      throw ApiError.forbidden('Your account is suspended. Contact admin.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token.');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired. Please login again.');
    }
    throw error;
  }
});

/**
 * Optional auth - doesn't throw if no token, but populates req.user if valid
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (error) {
      // Silently ignore invalid tokens for optional auth
    }
  }

  next();
});

module.exports = { authenticate, optionalAuth };
