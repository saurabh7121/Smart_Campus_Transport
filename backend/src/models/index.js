/**
 * CampusRide - Models Index
 * Central export for all Mongoose models
 */

module.exports = {
  User: require('./User'),
  ApprovedStudent: require('./ApprovedStudent'),
  Student: require('./Student'),
  Parent: require('./Parent'),
  Driver: require('./Driver'),
  Admin: require('./Admin'),
  Bus: require('./Bus'),
  Route: require('./Route'),
  BusStop: require('./BusStop'),
  Seat: require('./Seat'),
  SeatAllocation: require('./SeatAllocation'),
  Booking: require('./Booking'),
  WaitingList: require('./WaitingList'),
  Payment: require('./Payment'),
  BusPass: require('./BusPass'),
  Notification: require('./Notification'),
  LiveLocation: require('./LiveLocation'),
  Trip: require('./Trip'),
  LostAndFound: require('./LostAndFound'),
  AuditLog: require('./AuditLog'),
};
