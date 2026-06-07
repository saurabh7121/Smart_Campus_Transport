/**
 * CampusRide - Parent Model
 * Parent profile linked to User. Can monitor linked student's transport.
 */

const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    linkedStudents: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
        relationship: {
          type: String,
          enum: ['father', 'mother', 'guardian', 'other'],
          default: 'guardian',
        },
        linkedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Linking code used by student to link parent account
    linkingCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    linkingCodeExpiry: {
      type: Date,
    },
    // Notification preferences
    notifyOnBusDelay: {
      type: Boolean,
      default: true,
    },
    notifyOnBusArrival: {
      type: Boolean,
      default: true,
    },
    notifyOnTripStart: {
      type: Boolean,
      default: true,
    },
    notifyOnTripEnd: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

parentSchema.index({ user: 1 });
parentSchema.index({ linkingCode: 1 });

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
