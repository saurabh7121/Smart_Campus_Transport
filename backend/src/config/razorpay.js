/**
 * CampusRide - Razorpay Configuration
 * Payment gateway integration
 */

const Razorpay = require('razorpay');
const logger = require('../utils/logger');

let razorpayInstance = null;

const initializeRazorpay = () => {
  try {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id'
    ) {
      logger.warn('Razorpay credentials not configured. Payments will be disabled.');
      return null;
    }

    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    logger.info('Razorpay initialized');
    return razorpayInstance;
  } catch (error) {
    logger.error('Razorpay initialization failed:', error.message);
    return null;
  }
};

const getRazorpay = () => razorpayInstance;

module.exports = { initializeRazorpay, getRazorpay };
