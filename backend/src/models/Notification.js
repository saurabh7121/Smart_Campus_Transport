/**
 * CampusRide - Notification Model
 */
const mongoose = require('mongoose');
const { NOTIFICATION_TYPE } = require('../constants');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPE), default: NOTIFICATION_TYPE.GENERAL },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    // FCM delivery status
    fcmSent: { type: Boolean, default: false },
    fcmMessageId: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
