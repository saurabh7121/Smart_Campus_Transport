/**
 * CampusRide - Notification Service
 * Handles push notifications via Firebase Cloud Messaging
 */

const { getFirebaseApp } = require('../config/firebase');
const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Send push notification to a specific user
 */
const sendPushNotification = async (userId, { title, body, type, data = {} }) => {
  try {
    // Save to database
    const notification = await Notification.create({
      user: userId,
      title,
      body,
      type,
      data,
    });

    // Send via FCM
    const user = await User.findById(userId).select('fcmToken');
    if (user?.fcmToken && getFirebaseApp()) {
      const admin = require('firebase-admin');
      const message = {
        notification: { title, body },
        data: { type, notificationId: notification._id.toString(), ...data },
        token: user.fcmToken,
      };

      const result = await admin.messaging().send(message);
      notification.fcmSent = true;
      notification.fcmMessageId = result;
      await notification.save();
    }

    return notification;
  } catch (error) {
    logger.error(`Push notification failed for user ${userId}:`, error.message);
    return null;
  }
};

/**
 * Send notification to multiple users
 */
const sendBulkNotification = async (userIds, { title, body, type, data = {} }) => {
  const promises = userIds.map((id) =>
    sendPushNotification(id, { title, body, type, data })
  );
  return Promise.allSettled(promises);
};

/**
 * Get user's notifications with pagination
 */
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return { notifications, total, unreadCount, page, limit };
};

/**
 * Mark notifications as read
 */
const markAsRead = async (userId, notificationIds) => {
  if (notificationIds && notificationIds.length > 0) {
    await Notification.updateMany(
      { _id: { $in: notificationIds }, user: userId },
      { isRead: true, readAt: new Date() }
    );
  } else {
    // Mark all as read
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }
};

module.exports = {
  sendPushNotification,
  sendBulkNotification,
  getUserNotifications,
  markAsRead,
};
