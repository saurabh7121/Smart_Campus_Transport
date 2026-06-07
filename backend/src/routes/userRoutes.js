/**
 * CampusRide - User Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/student-profile', userController.updateStudentProfile);

module.exports = router;
