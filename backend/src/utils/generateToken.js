/**
 * CampusRide - JWT Token Generator
 * Handles access and refresh token generation
 */

const jwt = require('jsonwebtoken');

/**
 * Generate an access token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Generate a refresh token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

/**
 * Generate both access and refresh tokens for a user
 * @param {Object} user - User document from MongoDB
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokenPair = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken({ id: user._id }),
  };
};

/**
 * Verify an access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify a refresh token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
};
