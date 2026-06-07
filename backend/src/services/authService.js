/**
 * CampusRide - Auth Service
 * Business logic for authentication operations
 */

const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Driver = require('../models/Driver');
const Admin = require('../models/Admin');
const ApprovedStudent = require('../models/ApprovedStudent');
const ApiError = require('../utils/ApiError');
const { generateTokenPair, verifyRefreshToken } = require('../utils/generateToken');
const { sanitizeUser, generateRandomString } = require('../utils/helpers');
const { createAuditLog } = require('./auditService');
const { ROLES } = require('../constants/roles');
const { ACCOUNT_STATUS } = require('../constants');
const logger = require('../utils/logger');

/**
 * Register a new student
 * PRN must be pre-approved by admin
 */
const registerStudent = async (data, req) => {
  // 1. Verify PRN is in approved list
  const approved = await ApprovedStudent.findOne({
    prn: data.prn,
    academicYear: '2024-2025',
  });

  if (!approved) {
    throw ApiError.badRequest(
      'PRN not found in approved students list. Contact your college administration.'
    );
  }

  if (approved.isRegistered) {
    throw ApiError.conflict('This PRN has already been used for registration.');
  }

  // 2. Check if email already exists
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw ApiError.conflict('Email is already registered.');
  }

  // 3. Create base user
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: ROLES.STUDENT,
    status: ACCOUNT_STATUS.PENDING, // Admin must approve
  });

  // 4. Create student profile
  const student = await Student.create({
    user: user._id,
    prn: data.prn,
    department: data.department,
    year: data.year,
    division: data.division,
    rollNumber: data.rollNumber,
    guardianName: data.guardianName,
    guardianPhone: data.guardianPhone,
    guardianRelation: data.guardianRelation,
    address: data.address,
  });

  // 5. Mark PRN as registered
  approved.isRegistered = true;
  approved.registeredAt = new Date();
  await approved.save();

  // 6. Generate tokens
  const tokens = generateTokenPair(user);

  // 7. Save refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  // 8. Audit log
  await createAuditLog({
    userId: user._id,
    action: 'REGISTER',
    entity: 'Student',
    entityId: student._id,
    description: `Student ${data.name} registered with PRN ${data.prn}`,
    req,
  });

  return {
    user: sanitizeUser(user),
    student,
    tokens,
  };
};

/**
 * Register a new parent
 */
const registerParent = async (data, req) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw ApiError.conflict('Email is already registered.');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: ROLES.PARENT,
    status: ACCOUNT_STATUS.ACTIVE, // Parents are active immediately
  });

  const parentData = {
    user: user._id,
    linkingCode: generateRandomString(8).toUpperCase(),
    linkingCodeExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    linkedStudents: [],
  };

  // If linking code provided, link to student
  if (data.linkingCode) {
    const student = await Student.findOne({
      user: { $exists: true },
    }).populate('user');
    // Linking will be handled separately via a dedicated endpoint
  }

  const parent = await Parent.create(parentData);

  const tokens = generateTokenPair(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  await createAuditLog({
    userId: user._id,
    action: 'REGISTER',
    entity: 'Parent',
    entityId: parent._id,
    description: `Parent ${data.name} registered`,
    req,
  });

  return { user: sanitizeUser(user), parent, tokens };
};

/**
 * Register a new driver (admin-initiated)
 */
const registerDriver = async (data, req) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw ApiError.conflict('Email is already registered.');
  }

  const existingLicense = await Driver.findOne({ licenseNumber: data.licenseNumber });
  if (existingLicense) {
    throw ApiError.conflict('License number is already registered.');
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    role: ROLES.DRIVER,
    status: ACCOUNT_STATUS.ACTIVE,
  });

  const driver = await Driver.create({
    user: user._id,
    licenseNumber: data.licenseNumber,
    licenseExpiry: data.licenseExpiry,
    experienceYears: data.experienceYears,
    emergencyContact: data.emergencyContact,
    address: data.address,
  });

  const tokens = generateTokenPair(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  await createAuditLog({
    userId: req.user ? req.user._id : user._id,
    action: 'REGISTER',
    entity: 'Driver',
    entityId: driver._id,
    description: `Driver ${data.name} registered with license ${data.licenseNumber}`,
    req,
  });

  return { user: sanitizeUser(user), driver, tokens };
};

/**
 * Login user (all roles)
 */
const loginUser = async (email, password, req) => {
  // Find user with password field
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  // Check account status
  if (user.status === 'blocked') {
    throw ApiError.forbidden('Your account has been blocked. Contact admin.');
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  // Update refresh token and last login
  user.refreshToken = tokens.refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Get role-specific profile
  let profile = null;
  switch (user.role) {
    case ROLES.STUDENT:
      profile = await Student.findOne({ user: user._id })
        .populate('assignedBus', 'busNumber')
        .populate('assignedRoute', 'name routeCode');
      break;
    case ROLES.PARENT:
      profile = await Parent.findOne({ user: user._id })
        .populate('linkedStudents.student');
      break;
    case ROLES.DRIVER:
      profile = await Driver.findOne({ user: user._id })
        .populate('assignedBus', 'busNumber registrationNumber');
      break;
    case ROLES.ADMIN:
    case ROLES.SUPER_ADMIN:
      profile = await Admin.findOne({ user: user._id });
      break;
  }

  await createAuditLog({
    userId: user._id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user._id,
    description: `${user.role} ${user.name} logged in`,
    req,
  });

  return { user: sanitizeUser(user), profile, tokens };
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user) {
    throw ApiError.unauthorized('Invalid refresh token.');
  }

  if (user.refreshToken !== refreshToken) {
    throw ApiError.unauthorized('Refresh token has been revoked.');
  }

  const tokens = generateTokenPair(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return tokens;
};

/**
 * Logout user
 */
const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
    fcmToken: null,
  });
};

/**
 * Change password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect.');
  }

  user.password = newPassword;
  user.refreshToken = null; // Invalidate all sessions
  await user.save();

  const tokens = generateTokenPair(user);
  user.refreshToken = tokens.refreshToken;
  await user.save({ validateBeforeSave: false });

  return tokens;
};

module.exports = {
  registerStudent,
  registerParent,
  registerDriver,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changePassword,
};
