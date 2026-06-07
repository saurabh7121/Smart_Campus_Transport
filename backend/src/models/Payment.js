/**
 * CampusRide - Payment Model
 * Tracks all payment transactions via Razorpay.
 */

const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../constants');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    // Razorpay details
    razorpayOrderId: {
      type: String,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      trim: true,
    },
    // Amount details
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    // Payment info
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    // Description
    description: {
      type: String,
      trim: true,
    },
    paymentType: {
      type: String,
      enum: ['transport_fee', 'booking_fee', 'penalty', 'other'],
      default: 'transport_fee',
    },
    // Dates
    paidAt: {
      type: Date,
    },
    // Refund info
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundedAt: {
      type: Date,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    // Receipt
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
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

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ student: 1, academicYear: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
