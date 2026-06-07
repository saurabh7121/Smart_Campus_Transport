/**
 * CampusRide - Helper Utilities
 * Common utility functions used across the application
 */

const crypto = require('crypto');

/**
 * Generate a random alphanumeric string
 * @param {number} length - Length of the string
 * @returns {string}
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

/**
 * Generate a 6-digit OTP
 * @returns {string}
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a unique booking reference
 * @returns {string} e.g., "CR-20241015-A7F3B2"
 */
const generateBookingRef = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CR-${date}-${random}`;
};

/**
 * Generate a unique pass ID
 * @returns {string} e.g., "PASS-2024-XY3B9F"
 */
const generatePassId = () => {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PASS-${year}-${random}`;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Paginate query results
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} { skip, limit, page }
 */
const paginate = (page = 1, limit = 20) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  return {
    skip: (p - 1) * l,
    limit: l,
    page: p,
  };
};

/**
 * Build pagination metadata for response
 * @param {number} totalDocs - Total documents count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const buildPaginationMeta = (totalDocs, page, limit) => {
  const totalPages = Math.ceil(totalDocs / limit);
  return {
    totalDocs,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Sanitize user object - remove sensitive fields before sending to client
 * @param {Object} user - User document
 * @returns {Object} Sanitized user
 */
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

/**
 * Format seat label (e.g., row 1 seat 1 → "A1")
 * @param {number} row - Row number (1-indexed)
 * @param {number} seat - Seat number within row
 * @returns {string} Formatted seat label
 */
const formatSeatLabel = (row, seat) => {
  const rowLetter = String.fromCharCode(64 + row); // 1 → A, 2 → B, etc.
  return `${rowLetter}${seat}`;
};

module.exports = {
  generateRandomString,
  generateOTP,
  generateBookingRef,
  generatePassId,
  calculateDistance,
  paginate,
  buildPaginationMeta,
  sanitizeUser,
  formatSeatLabel,
};
