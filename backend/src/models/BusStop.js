/**
 * CampusRide - Bus Stop Model
 * Individual bus stops with geolocation and address.
 */

const mongoose = require('mongoose');

const busStopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stop name is required'],
      trim: true,
    },
    stopCode: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
      },
    },
    address: {
      street: { type: String, trim: true },
      area: { type: String, trim: true },
      city: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    // Landmark for easy identification
    landmark: {
      type: String,
      trim: true,
    },
    // Which routes pass through this stop
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    // Number of students assigned to this stop
    studentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

busStopSchema.index({ location: '2dsphere' });
busStopSchema.index({ stopCode: 1 });
busStopSchema.index({ isActive: 1 });

const BusStop = mongoose.model('BusStop', busStopSchema);

module.exports = BusStop;
