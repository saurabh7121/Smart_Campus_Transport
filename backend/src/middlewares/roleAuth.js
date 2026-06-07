/**
 * CampusRide - Role-Based Access Control Middleware
 * Restricts route access based on user roles
 */

const ApiError = require('../utils/ApiError');

/**
 * Authorize specific roles
 * @param  {...string} allowedRoles - Roles permitted to access the route
 * @returns {Function} Express middleware
 * 
 * Usage: authorize('admin', 'super_admin')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Access denied. Role '${req.user.role}' is not authorized for this resource.`
      );
    }

    next();
  };
};

/**
 * Check if user is admin or super_admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required.');
  }

  if (!['admin', 'super_admin'].includes(req.user.role)) {
    throw ApiError.forbidden('Admin access required.');
  }

  next();
};

/**
 * Check if user owns the resource or is admin
 * @param {string} userIdField - Field name in req.params that contains the user ID
 */
const isOwnerOrAdmin = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required.');
    }

    const resourceUserId = req.params[userIdField];
    const isOwner = req.user._id.toString() === resourceUserId;
    const isAdminUser = ['admin', 'super_admin'].includes(req.user.role);

    if (!isOwner && !isAdminUser) {
      throw ApiError.forbidden('You can only access your own resources.');
    }

    next();
  };
};

module.exports = { authorize, isAdmin, isOwnerOrAdmin };
