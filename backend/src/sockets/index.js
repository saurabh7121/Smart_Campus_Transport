/**
 * CampusRide - Socket.IO Event Handlers
 * Registers all real-time event listeners
 */

const logger = require('../utils/logger');

/**
 * Register socket event handlers for live tracking
 * Called from server initialization
 */
const registerSocketHandlers = (io) => {
  const trackingNamespace = io.of('/tracking');

  trackingNamespace.on('connection', (socket) => {
    logger.debug(`Tracking socket connected: ${socket.id}`);

    // Driver sends GPS location update
    socket.on('driver:location-update', (data) => {
      const { busId, location, speed, heading } = data;
      // Broadcast to all users tracking this bus
      socket.to(`bus:${busId}`).emit('bus:location-updated', {
        busId,
        location,
        speed,
        heading,
        timestamp: new Date(),
      });
    });

    // User starts tracking a bus
    socket.on('user:track-bus', (busId) => {
      socket.join(`bus:${busId}`);
      logger.debug(`User ${socket.id} started tracking bus ${busId}`);
    });

    // User stops tracking
    socket.on('user:stop-tracking', (busId) => {
      socket.leave(`bus:${busId}`);
    });

    // Trip started notification
    socket.on('driver:trip-started', (data) => {
      io.to(`bus:${data.busId}`).emit('trip:started', data);
    });

    // Trip ended notification
    socket.on('driver:trip-ended', (data) => {
      io.to(`bus:${data.busId}`).emit('trip:ended', data);
    });

    socket.on('disconnect', () => {
      logger.debug(`Tracking socket disconnected: ${socket.id}`);
    });
  });

  // Notifications namespace
  const notifNamespace = io.of('/notifications');

  notifNamespace.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      logger.debug(`Notification socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { registerSocketHandlers };
