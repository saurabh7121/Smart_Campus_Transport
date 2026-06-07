/**
 * CampusRide - Auth Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  registerStudentSchema,
  registerParentSchema,
  registerDriverSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateFcmTokenSchema,
} = require('../validations/authValidation');

// Public routes
router.post('/register/student', authLimiter, validate(registerStudentSchema), authController.registerStudent);
router.post('/register/parent', authLimiter, validate(registerParentSchema), authController.registerParent);
router.post('/register/driver', authLimiter, validate(registerDriverSchema), authController.registerDriver);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.get('/me', authenticate, authController.getMe);
router.patch('/fcm-token', authenticate, validate(updateFcmTokenSchema), authController.updateFcmToken);

module.exports = router;
