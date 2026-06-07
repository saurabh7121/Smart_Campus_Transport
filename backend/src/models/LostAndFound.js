/**
 * CampusRide - Lost and Found Model
 */
const mongoose = require('mongoose');
const { LOST_FOUND_STATUS } = require('../constants');

const lostAndFoundSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    itemName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, enum: ['electronics', 'clothing', 'documents', 'accessories', 'other'], default: 'other' },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    images: [{ type: String }],
    status: { type: String, enum: Object.values(LOST_FOUND_STATUS), default: LOST_FOUND_STATUS.REPORTED },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    contactPhone: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

lostAndFoundSchema.index({ type: 1, status: 1, createdAt: -1 });
lostAndFoundSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('LostAndFound', lostAndFoundSchema);
