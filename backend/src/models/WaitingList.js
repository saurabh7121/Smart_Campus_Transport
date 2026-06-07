/**
 * CampusRide - Waiting List Model
 * Manages students waiting for seats on full buses.
 * Auto-notifies when seats become available.
 */

const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema(
  {
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
    // Position in the queue
    position: {
      type: Number,
      required: true,
    },
    // Status
    status: {
      type: String,
      enum: ['waiting', 'offered', 'accepted', 'expired', 'cancelled'],
      default: 'waiting',
    },
    // When seat was offered
    offeredAt: {
      type: Date,
    },
    // Offer expiry (e.g., 24 hours to accept)
    offerExpiry: {
      type: Date,
    },
    // When student responded
    respondedAt: {
      type: Date,
    },
    academicYear: {
      type: String,
      default: '2024-2025',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One active waiting list entry per student per route
waitingListSchema.index(
  { student: 1, route: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'waiting' } }
);
waitingListSchema.index({ bus: 1, route: 1, position: 1 });

const WaitingList = mongoose.model('WaitingList', waitingListSchema);

module.exports = WaitingList;
