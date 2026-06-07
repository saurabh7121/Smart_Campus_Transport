/**
 * CampusRide - Bus Pass Model
 * Digital bus pass with QR code for verification.
 */

const mongoose = require('mongoose');
const { PASS_STATUS } = require('../constants');

const busPassSchema = new mongoose.Schema(
  {
    passId: { type: String, required: true, unique: true, trim: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    seatLabel: { type: String },
    stopName: { type: String },
    qrCodeData: { type: String, required: true },
    qrCodeImage: { type: String },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    status: { type: String, enum: Object.values(PASS_STATUS), default: PASS_STATUS.ACTIVE },
    passType: { type: String, enum: ['monthly', 'quarterly', 'half_yearly', 'yearly'], default: 'yearly' },
    academicYear: { type: String, default: '2024-2025' },
    lastVerifiedAt: { type: Date },
    verificationCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

busPassSchema.index({ passId: 1 });
busPassSchema.index({ student: 1, status: 1 });

busPassSchema.virtual('isValid').get(function () {
  const now = new Date();
  return this.status === PASS_STATUS.ACTIVE && now >= this.validFrom && now <= this.validUntil;
});

module.exports = mongoose.model('BusPass', busPassSchema);
