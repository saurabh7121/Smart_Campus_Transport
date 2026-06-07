/**
 * CampusRide - Live Location Model
 * Real-time GPS coordinates for bus tracking.
 */
const mongoose = require('mongoose');

const liveLocationSchema = new mongoose.Schema(
  {
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    speed: { type: Number, default: 0 },    // km/h
    heading: { type: Number, default: 0 },  // degrees
    accuracy: { type: Number },             // meters
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

liveLocationSchema.index({ bus: 1, timestamp: -1 });
liveLocationSchema.index({ location: '2dsphere' });
// TTL index: auto-delete old locations after 24 hours
liveLocationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('LiveLocation', liveLocationSchema);
