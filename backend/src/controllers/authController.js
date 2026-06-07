/**
 * CampusRide - Auth Controller
 * Handles registration, login, token refresh, and logout
 */

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/authService');

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * POST /api/auth/register/student
 * Register a new student with PRN verification
 */
const registerStudent = asyncHandler(async (req, res) => {
  const result = await authService.registerStudent(req.body, req);

  res.cookie('accessToken', result.tokens.accessToken, cookieOptions);
  res.cookie('refreshToken', result.tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  new ApiResponse(201, 'Student registered successfully. Awaiting admin approval.', {
    user: result.user,
    student: result.student,
    tokens: result.tokens,
  }).send(res);
});

/**
 * POST /api/auth/register/parent
 */
const registerParent = asyncHandler(async (req, res) => {
  const result = await authService.registerParent(req.body, req);

  res.cookie('accessToken', result.tokens.accessToken, cookieOptions);
  res.cookie('refreshToken', result.tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  new ApiResponse(201, 'Parent registered successfully.', {
    user: result.user,
    parent: result.parent,
    tokens: result.tokens,
  }).send(res);
});

/**
 * POST /api/auth/register/driver
 */
const registerDriver = asyncHandler(async (req, res) => {
  const result = await authService.registerDriver(req.body, req);

  res.cookie('accessToken', result.tokens.accessToken, cookieOptions);
  res.cookie('refreshToken', result.tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  new ApiResponse(201, 'Driver registered successfully.', {
    user: result.user,
    driver: result.driver,
    tokens: result.tokens,
  }).send(res);
});

/**
 * POST /api/auth/login
 * Login for all roles
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password, req);

  res.cookie('accessToken', result.tokens.accessToken, cookieOptions);
  res.cookie('refreshToken', result.tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  new ApiResponse(200, 'Login successful.', {
    user: result.user,
    profile: result.profile,
    tokens: result.tokens,
  }).send(res);
});

/**
 * POST /api/auth/refresh-token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  const tokens = await authService.refreshAccessToken(token);

  res.cookie('accessToken', tokens.accessToken, cookieOptions);
  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  new ApiResponse(200, 'Token refreshed.', { tokens }).send(res);
});

/**
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user._id);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  new ApiResponse(200, 'Logged out successfully.').send(res);
});

/**
 * POST /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const tokens = await authService.changePassword(req.user._id, currentPassword, newPassword);

  res.cookie('accessToken', tokens.accessToken, cookieOptions);

  new ApiResponse(200, 'Password changed successfully.', { tokens }).send(res);
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
const getMe = asyncHandler(async (req, res) => {
  new ApiResponse(200, 'User profile retrieved.', { user: req.user }).send(res);
});

/**
 * PATCH /api/auth/fcm-token
 * Update FCM token for push notifications
 */
const updateFcmToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;
  req.user.fcmToken = fcmToken;
  await req.user.save({ validateBeforeSave: false });

  new ApiResponse(200, 'FCM token updated.').send(res);
});

module.exports = {
  registerStudent,
  registerParent,
  registerDriver,
  login,
  refreshToken,
  logout,
  changePassword,
  getMe,
  updateFcmToken,
};
