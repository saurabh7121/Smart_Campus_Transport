/**
 * CampusRide - Route Model
 * Transport routes with ordered stops, distance, and timing.
 */

const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
    },
    routeCode: {
      type: String,
      required: [true, 'Route code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Ordered list of stops
    stops: [
      {
        stop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'BusStop',
        },
        order: {
          type: Number,
          required: true,
        },
        estimatedArrivalTime: {
          type: String, // "07:30 AM"
        },
        distanceFromStart: {
          type: Number, // in km
          default: 0,
        },
      },
    ],
    // Start and end points
    startLocation: {
      name: { type: String, trim: true },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    endLocation: {
      name: { type: String, trim: true, default: 'College Campus' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    // Route metrics
    totalDistance: {
      type: Number, // in km
      default: 0,
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 0,
    },
    // Timing
    morningDepartureTime: {
      type: String, // "06:30 AM"
    },
    eveningDepartureTime: {
      type: String, // "04:30 PM"
    },
    // Pricing
    baseFare: {
      type: Number,
      default: 0,
    },
    monthlyFare: {
      type: Number,
      default: 0,
    },
    yearlyFare: {
      type: Number,
      default: 0,
    },
    // Assigned buses
    assignedBuses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
      },
    ],
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    // Polyline for map display
    polyline: {
      type: String, // Encoded polyline string
    },
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

routeSchema.index({ routeCode: 1 });
routeSchema.index({ isActive: 1 });

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
