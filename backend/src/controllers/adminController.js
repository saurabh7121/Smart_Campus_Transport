/**
 * CampusRide - Admin Controller
 * Admin-only operations: student approval, bulk PRN upload, user management
 */

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const Student = require('../models/Student');
const ApprovedStudent = require('../models/ApprovedStudent');
const Admin = require('../models/Admin');
const { paginate, buildPaginationMeta } = require('../utils/helpers');
const { createAuditLog } = require('../services/auditService');
const { ACCOUNT_STATUS } = require('../constants');

/**
 * POST /api/admin/approved-students
 * Add PRNs to approved students list (bulk or single)
 */
const addApprovedStudents = asyncHandler(async (req, res) => {
  const { students } = req.body; // Array of { prn, name, email, department, year }

  if (!students || !Array.isArray(students) || students.length === 0) {
    throw ApiError.badRequest('Please provide an array of students with PRN data.');
  }

  const results = { added: 0, skipped: 0, errors: [] };

  for (const s of students) {
    try {
      await ApprovedStudent.create({
        prn: s.prn.toUpperCase(),
        name: s.name,
        email: s.email,
        department: s.department,
        year: s.year,
        addedBy: req.user._id,
      });
      results.added++;
    } catch (error) {
      if (error.code === 11000) {
        results.skipped++;
      } else {
        results.errors.push({ prn: s.prn, error: error.message });
      }
    }
  }

  await createAuditLog({
    userId: req.user._id,
    action: 'BULK_ADD_APPROVED_STUDENTS',
    entity: 'ApprovedStudent',
    description: `Added ${results.added} PRNs, skipped ${results.skipped} duplicates`,
    req,
  });

  new ApiResponse(201, `Added ${results.added} students to approved list.`, results).send(res);
});

/**
 * GET /api/admin/approved-students
 * List all approved PRNs with filters
 */
const getApprovedStudents = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  const { search, isRegistered, academicYear } = req.query;

  const filter = {};
  if (isRegistered !== undefined) filter.isRegistered = isRegistered === 'true';
  if (academicYear) filter.academicYear = academicYear;
  if (search) {
    filter.$or = [
      { prn: { $regex: search, $options: 'i' } },
      { name: { $regex: search, $options: 'i' } },
    ];
  }

  const [students, total] = await Promise.all([
    ApprovedStudent.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ApprovedStudent.countDocuments(filter),
  ]);

  new ApiResponse(200, 'Approved students retrieved.', {
    students,
    pagination: buildPaginationMeta(total, page, limit),
  }).send(res);
});

/**
 * PATCH /api/admin/students/:studentId/approve
 * Approve a pending student registration
 */
const approveStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId).populate('user');

  if (!student) throw ApiError.notFound('Student not found.');
  if (!student.user) throw ApiError.notFound('Associated user not found.');

  if (student.user.status === ACCOUNT_STATUS.ACTIVE) {
    throw ApiError.badRequest('Student is already approved.');
  }

  await User.findByIdAndUpdate(student.user._id, { status: ACCOUNT_STATUS.ACTIVE });

  await createAuditLog({
    userId: req.user._id,
    action: 'APPROVE_STUDENT',
    entity: 'Student',
    entityId: student._id,
    description: `Admin approved student ${student.user.name} (PRN: ${student.prn})`,
    changes: { before: { status: student.user.status }, after: { status: ACCOUNT_STATUS.ACTIVE } },
    req,
  });

  new ApiResponse(200, 'Student approved successfully.').send(res);
});

/**
 * PATCH /api/admin/students/:studentId/block
 * Block a student
 */
const blockStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { reason } = req.body;
  const student = await Student.findById(studentId).populate('user');

  if (!student) throw ApiError.notFound('Student not found.');

  await User.findByIdAndUpdate(student.user._id, { status: ACCOUNT_STATUS.BLOCKED });

  await createAuditLog({
    userId: req.user._id,
    action: 'BLOCK_STUDENT',
    entity: 'Student',
    entityId: student._id,
    description: `Admin blocked student ${student.user.name}. Reason: ${reason || 'N/A'}`,
    req,
  });

  new ApiResponse(200, 'Student blocked.').send(res);
});

/**
 * GET /api/admin/students
 * List all students with filters
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const { page, limit } = paginate(req.query.page, req.query.limit);
  const { status, department, year, search, bus, route } = req.query;

  const userFilter = {};
  const studentFilter = {};

  if (status) userFilter.status = status;
  if (department) studentFilter.department = department;
  if (year) studentFilter.year = parseInt(year);
  if (bus) studentFilter.assignedBus = bus;
  if (route) studentFilter.assignedRoute = route;

  // Build pipeline for search
  let students;
  let total;

  if (search) {
    students = await Student.find(studentFilter)
      .populate({
        path: 'user',
        match: {
          ...userFilter,
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        },
        select: '-password -refreshToken',
      })
      .populate('assignedBus', 'busNumber')
      .populate('assignedRoute', 'name routeCode')
      .populate('assignedStop', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Filter out students where user didn't match
    students = students.filter((s) => s.user !== null);
    total = students.length;
  } else {
    [students, total] = await Promise.all([
      Student.find(studentFilter)
        .populate({ path: 'user', match: userFilter, select: '-password -refreshToken' })
        .populate('assignedBus', 'busNumber')
        .populate('assignedRoute', 'name routeCode')
        .populate('assignedStop', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Student.countDocuments(studentFilter),
    ]);
    students = students.filter((s) => s.user !== null);
  }

  new ApiResponse(200, 'Students retrieved.', {
    students,
    pagination: buildPaginationMeta(total, page, limit),
  }).send(res);
});

/**
 * GET /api/admin/dashboard/stats
 * Dashboard statistics
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    pendingStudents,
    activeStudents,
    totalUsers,
  ] = await Promise.all([
    Student.countDocuments(),
    User.countDocuments({ role: 'student', status: 'pending' }),
    User.countDocuments({ role: 'student', status: 'active' }),
    User.countDocuments(),
  ]);

  // Import here to avoid circular deps
  const Bus = require('../models/Bus');
  const Route = require('../models/Route');
  const Driver = require('../models/Driver');

  const [totalBuses, activeBuses, totalRoutes, totalDrivers] = await Promise.all([
    Bus.countDocuments(),
    Bus.countDocuments({ status: 'active' }),
    Route.countDocuments({ isActive: true }),
    Driver.countDocuments(),
  ]);

  new ApiResponse(200, 'Dashboard stats retrieved.', {
    stats: {
      totalStudents,
      pendingStudents,
      activeStudents,
      totalUsers,
      totalBuses,
      activeBuses,
      totalRoutes,
      totalDrivers,
    },
  }).send(res);
});

module.exports = {
  addApprovedStudents,
  getApprovedStudents,
  approveStudent,
  blockStudent,
  getAllStudents,
  getDashboardStats,
};
