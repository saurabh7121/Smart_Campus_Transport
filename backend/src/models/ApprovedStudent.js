/**
 * CampusRide - Approved Students Model
 * Pre-approved student PRNs uploaded by college admin.
 * Students can only register if their PRN exists in this collection.
 */

const mongoose = require('mongoose');

const approvedStudentSchema = new mongoose.Schema(
  {
    prn: {
      type: String,
      required: [true, 'PRN is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 5,
    },
    academicYear: {
      type: String,
      required: true,
      default: '2024-2025',
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    registeredAt: {
      type: Date,
      default: null,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

approvedStudentSchema.index({ prn: 1 });
approvedStudentSchema.index({ academicYear: 1, isRegistered: 1 });

const ApprovedStudent = mongoose.model('ApprovedStudent', approvedStudentSchema);

module.exports = ApprovedStudent;
