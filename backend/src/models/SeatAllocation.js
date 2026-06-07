/**
 * CampusRide - Seat Allocation Model
 * Tracks seat allocation history and current assignments.
 * One student = one permanent seat per academic year.
 */

const mongoose = require('mongoose');

const seatAllocationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
    },
    seatLabel: {
      type: String,
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    stop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusStop',
    },
    academicYear: {
      type: String,
      required: true,
      default: '2024-2025',
    },
    // Allocation dates
    allocatedAt: {
      type: Date,
      default: Date.now,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
    },
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    // Allocated by (admin reference)
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Change history
    previousSeat: {
      type: String,
      default: null,
    },
    changeReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One active allocation per student per academic year
seatAllocationSchema.index(
  { student: 1, academicYear: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);
seatAllocationSchema.index({ bus: 1, seat: 1, isActive: 1 });

const SeatAllocation = mongoose.model('SeatAllocation', seatAllocationSchema);

module.exports = SeatAllocation;
