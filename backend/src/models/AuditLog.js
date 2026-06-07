/**
 * CampusRide - Audit Log Model
 * Tracks all important actions for accountability.
 */
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true, trim: true },
    entity: { type: String, required: true, trim: true }, // e.g., 'Student', 'Bus', 'Route'
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, trim: true },
    changes: {
      before: { type: mongoose.Schema.Types.Mixed },
      after: { type: mongoose.Schema.Types.Mixed },
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
