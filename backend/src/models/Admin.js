/**
 * CampusRide - Admin Model
 * Admin profile with permission levels and department assignment.
 */

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'Transport',
    },
    designation: {
      type: String,
      trim: true,
    },
    permissions: {
      manageStudents: { type: Boolean, default: true },
      manageBuses: { type: Boolean, default: true },
      manageRoutes: { type: Boolean, default: true },
      manageDrivers: { type: Boolean, default: true },
      managePayments: { type: Boolean, default: true },
      viewReports: { type: Boolean, default: true },
      viewAuditLogs: { type: Boolean, default: true },
      manageSettings: { type: Boolean, default: false },
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

adminSchema.index({ user: 1 });
adminSchema.index({ employeeId: 1 });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
