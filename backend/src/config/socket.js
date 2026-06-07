/**
 * CampusRide - Socket.IO Configuration
 * Real-time communication setup for live tracking and notifications
 */

const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io = null;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    // Join role-specific rooms
    socket.on('join:role', (role) => {
      socket.join(`role:${role}`);
      logger.debug(`Socket ${socket.id} joined room role:${role}`);
    });

    // Join user-specific room for targeted notifications
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      logger.debug(`Socket ${socket.id} joined room user:${userId}`);
    });

    // Join bus tracking room
    socket.on('join:bus', (busId) => {
      socket.join(`bus:${busId}`);
      logger.debug(`Socket ${socket.id} joined bus tracking room: ${busId}`);
    });

    // Leave bus tracking room
    socket.on('leave:bus', (busId) => {
      socket.leave(`bus:${busId}`);
    });

    socket.on('disconnect', (reason) => {
      logger.debug(`Socket disconnected: ${socket.id} (${reason})`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
