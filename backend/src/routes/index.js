/**
 * CampusRide - Route Aggregator
 * Central registration of all API routes
 */

const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusRide API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API v1 routes
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
