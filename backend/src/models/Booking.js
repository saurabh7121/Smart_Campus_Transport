/**
 * CampusRide - Booking Model
 * Transport booking with route selection, seat assignment, and status tracking.
 */

const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../constants');

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    stop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusStop',
      required: true,
    },
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
    },
    seatLabel: {
      type: String,
    },
    // Booking details
    bookingType: {
      type: String,
      enum: ['monthly', 'quarterly', 'half_yearly', 'yearly'],
      default: 'yearly',
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    // Pricing
    amount: {
      type: Number,
      required: [true, 'Booking amount is required'],
      min: 0,
    },
    // Dates
    validFrom: {
      type: Date,
    },
    validUntil: {
      type: Date,
    },
    academicYear: {
      type: String,
      default: '2024-2025',
    },
    // Payment reference
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    // Cancellation
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    // Admin notes
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.index({ student: 1, academicYear: 1 });
bookingSchema.index({ bookingRef: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bus: 1, route: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
