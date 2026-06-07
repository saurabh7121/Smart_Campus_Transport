/**
 * CampusRide - Bus Model
 * Bus fleet management with capacity, status, and assignment tracking.
 */

const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Bus capacity is required'],
      min: [10, 'Minimum capacity is 10'],
      max: [80, 'Maximum capacity is 80'],
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Seat layout configuration
    seatLayout: {
      rows: { type: Number, default: 12 },
      seatsPerRow: { type: Number, default: 4 },
      lastRowSeats: { type: Number, default: 5 }, // Last row often has 5 seats
    },
    // Assigned route
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    // Assigned driver
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    // Bus details
    make: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    color: {
      type: String,
      trim: true,
    },
    // Status
    status: {
      type: String,
      enum: ['active', 'maintenance', 'retired', 'inactive'],
      default: 'active',
    },
    // Features
    hasAC: {
      type: Boolean,
      default: false,
    },
    hasGPS: {
      type: Boolean,
      default: true,
    },
    hasWifi: {
      type: Boolean,
      default: false,
    },
    // Insurance and fitness
    insuranceExpiry: {
      type: Date,
    },
    fitnessExpiry: {
      type: Date,
    },
    permitExpiry: {
      type: Date,
    },
    // Images
    images: [
      {
        type: String,
      },
    ],
    // Academic year
    academicYear: {
      type: String,
      default: '2024-2025',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

busSchema.index({ busNumber: 1 });
busSchema.index({ assignedRoute: 1 });
busSchema.index({ status: 1 });

// Virtual: check if bus is full
busSchema.virtual('isFull').get(function () {
  return this.currentOccupancy >= this.capacity;
});

// Virtual: available seats
busSchema.virtual('availableSeats').get(function () {
  return this.capacity - this.currentOccupancy;
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
