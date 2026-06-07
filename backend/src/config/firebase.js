/**
 * CampusRide - Firebase Admin SDK Configuration
 * Used for push notifications via FCM
 */

const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID === 'your_firebase_project_id'
    ) {
      logger.warn('Firebase credentials not configured. Push notifications will be disabled.');
      return null;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    logger.info('Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    logger.error('Firebase initialization failed:', error.message);
    return null;
  }
};

const getFirebaseApp = () => firebaseApp;

module.exports = { initializeFirebase, getFirebaseApp };
