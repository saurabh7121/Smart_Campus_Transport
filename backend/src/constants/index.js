/**
 * CampusRide - Application Constants
 * Central location for all app-wide constants
 */

const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  WAITLISTED: 'waitlisted',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

const TRIP_STATUS = Object.freeze({
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const TRIP_TYPE = Object.freeze({
  MORNING: 'morning',
  EVENING: 'evening',
});

const PASS_STATUS = Object.freeze({
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
  PENDING: 'pending',
});

const LOST_FOUND_STATUS = Object.freeze({
  REPORTED: 'reported',
  FOUND: 'found',
  CLAIMED: 'claimed',
  CLOSED: 'closed',
});

const NOTIFICATION_TYPE = Object.freeze({
  BOOKING: 'booking',
  PAYMENT: 'payment',
  BUS_ALERT: 'bus_alert',
  TRIP_UPDATE: 'trip_update',
  GENERAL: 'general',
  WAITLIST: 'waitlist',
  PASS: 'pass',
  LOST_FOUND: 'lost_found',
});

const ACCOUNT_STATUS = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BLOCKED: 'blocked',
});

const SEAT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
});

const ACADEMIC_YEAR = Object.freeze({
  CURRENT: '2024-2025',
});

const GPS_UPDATE_INTERVAL = 5000; // 5 seconds
const MAX_SEATS_PER_BUS = 60;
const WAITLIST_MAX_SIZE = 20;

module.exports = {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  TRIP_STATUS,
  TRIP_TYPE,
  PASS_STATUS,
  LOST_FOUND_STATUS,
  NOTIFICATION_TYPE,
  ACCOUNT_STATUS,
  SEAT_STATUS,
  ACADEMIC_YEAR,
  GPS_UPDATE_INTERVAL,
  MAX_SEATS_PER_BUS,
  WAITLIST_MAX_SIZE,
};
