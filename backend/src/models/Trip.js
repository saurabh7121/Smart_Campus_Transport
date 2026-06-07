/**
 * CampusRide - Trip Model
 * Tracks individual bus trips (morning/evening).
 */
const mongoose = require('mongoose');
const { TRIP_STATUS, TRIP_TYPE } = require('../constants');

const tripSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    tripType: { type: String, enum: Object.values(TRIP_TYPE), required: true },
    status: { type: String, enum: Object.values(TRIP_STATUS), default: TRIP_STATUS.NOT_STARTED },
    startedAt: { type: Date },
    completedAt: { type: Date },
    // Track students who boarded
    boardedStudents: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        boardedAt: { type: Date, default: Date.now },
        stop: { type: mongoose.Schema.Types.ObjectId, ref: 'BusStop' },
      },
    ],
    // Route snapshot at trip start
    totalStudentsExpected: { type: Number, default: 0 },
    totalStudentsBoarded: { type: Number, default: 0 },
    // Distance and duration
    distanceCovered: { type: Number, default: 0 },  // km
    duration: { type: Number, default: 0 },          // minutes
    // Notes
    notes: { type: String, trim: true },
    date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) },
  },
  { timestamps: true }
);

tripSchema.index({ bus: 1, date: -1 });
tripSchema.index({ driver: 1, date: -1 });
tripSchema.index({ status: 1 });

module.exports = mongoose.model('Trip', tripSchema);
