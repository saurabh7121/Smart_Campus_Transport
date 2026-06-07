/**
 * CampusRide - User Controller
 * Profile management for authenticated users
 */

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const Driver = require('../models/Driver');
const { sanitizeUser } = require('../utils/helpers');
const { createAuditLog } = require('../services/auditService');

/**
 * GET /api/users/profile
 * Get full profile based on role
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  let profile = null;

  switch (user.role) {
    case 'student':
      profile = await Student.findOne({ user: user._id })
        .populate('assignedBus', 'busNumber registrationNumber capacity')
        .populate('assignedRoute', 'name routeCode totalDistance')
        .populate('assignedStop', 'name landmark');
      break;
    case 'parent':
      profile = await Parent.findOne({ user: user._id })
        .populate({
          path: 'linkedStudents.student',
          populate: [
            { path: 'user', select: 'name email phone' },
            { path: 'assignedBus', select: 'busNumber' },
            { path: 'assignedRoute', select: 'name routeCode' },
          ],
        });
      break;
    case 'driver':
      profile = await Driver.findOne({ user: user._id })
        .populate('assignedBus', 'busNumber registrationNumber capacity assignedRoute')
        .populate('currentTrip');
      break;
    default:
      profile = null;
  }

  new ApiResponse(200, 'Profile retrieved.', { user, profile }).send(res);
});

/**
 * PATCH /api/users/profile
 * Update basic profile info
 */
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'avatar'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  await createAuditLog({
    userId: req.user._id,
    action: 'UPDATE_PROFILE',
    entity: 'User',
    entityId: req.user._id,
    description: `User ${user.name} updated profile`,
    req,
  });

  new ApiResponse(200, 'Profile updated.', { user: sanitizeUser(user) }).send(res);
});

/**
 * PATCH /api/users/student-profile
 * Update student-specific details
 */
const updateStudentProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    throw ApiError.forbidden('Only students can update student profile.');
  }

  const allowedFields = ['guardianName', 'guardianPhone', 'guardianRelation', 'address', 'homeLocation'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!student) {
    throw ApiError.notFound('Student profile not found.');
  }

  new ApiResponse(200, 'Student profile updated.', { student }).send(res);
});

module.exports = { getProfile, updateProfile, updateStudentProfile };
