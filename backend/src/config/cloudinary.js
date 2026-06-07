/**
 * CampusRide - Cloudinary Configuration
 * File upload service for photos and documents
 */

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const logger = require('../utils/logger');

const initializeCloudinary = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name'
  ) {
    logger.warn('Cloudinary credentials not configured. File uploads will use local storage.');
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  logger.info('Cloudinary configured');
  return true;
};

// Cloudinary storage for multer
const createCloudinaryStorage = (folder = 'campusride') => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `campusride/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
    },
  });
};

// Multer upload middleware factory
const createUpload = (folder = 'general', maxFiles = 1) => {
  const storage = createCloudinaryStorage(folder);
  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
};

module.exports = { initializeCloudinary, createUpload, cloudinary };
