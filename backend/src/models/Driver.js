/**
 * CampusRide - Driver Model
 * Driver profile with license info, assigned bus, and trip status.
 */

const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    licenseExpiry: {
      type: Date,
      required: [true, 'License expiry date is required'],
    },
    licenseImage: {
      type: String,
      default: null,
    },
    // Assigned bus
    assignedBus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      default: null,
    },
    // Current trip state
    isOnTrip: {
      type: Boolean,
      default: false,
    },
    currentTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
    // Experience
    experienceYears: {
      type: Number,
      default: 0,
    },
    // Emergency contact
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
    // Address
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    // Stats
    totalTrips: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

driverSchema.index({ user: 1 });
driverSchema.index({ assignedBus: 1 });
driverSchema.index({ licenseNumber: 1 });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
