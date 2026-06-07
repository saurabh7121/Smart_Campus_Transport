/**
 * CampusRide - Seat Model
 * Individual seat within a bus. Tracks seat label, status, and allocation.
 */

const mongoose = require('mongoose');
const { SEAT_STATUS } = require('../constants');

const seatSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: true,
    },
    seatLabel: {
      type: String,
      required: [true, 'Seat label is required'],
      trim: true,
      uppercase: true,
    },
    row: {
      type: Number,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
    // Window or aisle
    position: {
      type: String,
      enum: ['window', 'aisle', 'middle'],
      default: 'aisle',
    },
    status: {
      type: String,
      enum: Object.values(SEAT_STATUS),
      default: SEAT_STATUS.AVAILABLE,
    },
    // Currently allocated student
    allocatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
    },
    academicYear: {
      type: String,
      default: '2024-2025',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: unique seat per bus
seatSchema.index({ bus: 1, seatLabel: 1 }, { unique: true });
seatSchema.index({ bus: 1, status: 1 });
seatSchema.index({ allocatedTo: 1 });

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
