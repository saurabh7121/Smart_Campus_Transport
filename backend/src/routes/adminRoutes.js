/**
 * CampusRide - Admin Routes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/roleAuth');

// All admin routes require authentication + admin role
router.use(authenticate, isAdmin);

// Approved students (PRN management)
router.post('/approved-students', adminController.addApprovedStudents);
router.get('/approved-students', adminController.getApprovedStudents);

// Student management
router.get('/students', adminController.getAllStudents);
router.patch('/students/:studentId/approve', adminController.approveStudent);
router.patch('/students/:studentId/block', adminController.blockStudent);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;
