/**
 * CampusRide - Auth Validation Schemas
 */

const Joi = require('joi');

const registerStudentSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({ 'any.required': 'Name is required' }),
    email: Joi.string().email().trim().lowercase().required()
      .messages({ 'any.required': 'Email is required' }),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required()
      .messages({
        'string.pattern.base': 'Please provide a valid 10-digit Indian phone number',
        'any.required': 'Phone number is required',
      }),
    password: Joi.string().min(6).max(128).required()
      .messages({ 'string.min': 'Password must be at least 6 characters' }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
    prn: Joi.string().trim().uppercase().required()
      .messages({ 'any.required': 'PRN (Permanent Registration Number) is required' }),
    department: Joi.string().trim().required(),
    year: Joi.number().integer().min(1).max(5).required(),
    division: Joi.string().trim().optional(),
    rollNumber: Joi.string().trim().optional(),
    guardianName: Joi.string().trim().optional(),
    guardianPhone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
    guardianRelation: Joi.string().trim().optional(),
    address: Joi.object({
      street: Joi.string().trim().optional(),
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      pincode: Joi.string().trim().optional(),
    }).optional(),
  }),
};

const registerParentSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().trim().lowercase().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    password: Joi.string().min(6).max(128).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
    linkingCode: Joi.string().trim().optional(),
    relationship: Joi.string().valid('father', 'mother', 'guardian', 'other').optional(),
  }),
};

const registerDriverSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().trim().lowercase().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
    password: Joi.string().min(6).max(128).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({ 'any.only': 'Passwords do not match' }),
    licenseNumber: Joi.string().trim().uppercase().required(),
    licenseExpiry: Joi.date().greater('now').required()
      .messages({ 'date.greater': 'License must not be expired' }),
    experienceYears: Joi.number().min(0).optional(),
    emergencyContact: Joi.object({
      name: Joi.string().trim().optional(),
      phone: Joi.string().pattern(/^[6-9]\d{9}$/).optional(),
      relationship: Joi.string().trim().optional(),
    }).optional(),
    address: Joi.object({
      street: Joi.string().trim().optional(),
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      pincode: Joi.string().trim().optional(),
    }).optional(),
  }),
};

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().trim().lowercase().required()
      .messages({ 'any.required': 'Email is required' }),
    password: Joi.string().required()
      .messages({ 'any.required': 'Password is required' }),
  }),
};

const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required()
      .messages({ 'any.required': 'Refresh token is required' }),
  }),
};

const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({ 'any.only': 'New passwords do not match' }),
  }),
};

const updateFcmTokenSchema = {
  body: Joi.object({
    fcmToken: Joi.string().required(),
  }),
};

module.exports = {
  registerStudentSchema,
  registerParentSchema,
  registerDriverSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateFcmTokenSchema,
};
