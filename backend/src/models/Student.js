/**
 * CampusRide - Student Model
 * Extended student profile linked to base User model.
 * Contains academic info, transport assignment, and guardian details.
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    prn: {
      type: String,
      required: [true, 'PRN is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 1,
      max: 5,
    },
    division: {
      type: String,
      trim: true,
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    academicYear: {
      type: String,
      default: '2024-2025',
    },
    // Transport assignment
    assignedBus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      default: null,
    },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    assignedStop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusStop',
      default: null,
    },
    assignedSeat: {
      type: String,
      default: null,
    },
    // Guardian info
    guardianName: {
      type: String,
      trim: true,
    },
    guardianPhone: {
      type: String,
      trim: true,
    },
    guardianRelation: {
      type: String,
      trim: true,
    },
    // Address
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    homeLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    // Linked parent account
    linkedParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Transport status
    hasActivePass: {
      type: Boolean,
      default: false,
    },
    transportFeesPaid: {
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

studentSchema.index({ prn: 1 });
studentSchema.index({ user: 1 });
studentSchema.index({ assignedBus: 1 });
studentSchema.index({ assignedRoute: 1 });
studentSchema.index({ 'homeLocation': '2dsphere' });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
