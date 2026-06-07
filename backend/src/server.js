/**
 * CampusRide - Server Entry Point
 * Initializes database, services, Socket.IO, and starts the HTTP server
 */

require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initializeSocket } = require('./config/socket');
const { initializeFirebase } = require('./config/firebase');
const { initializeCloudinary } = require('./config/cloudinary');
const { initializeRazorpay } = require('./config/razorpay');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialize third-party services
    initializeFirebase();
    initializeCloudinary();
    initializeRazorpay();

    // 3. Create HTTP server
    const server = http.createServer(app);

    // 4. Initialize Socket.IO
    initializeSocket(server);

    // 5. Start listening
    server.listen(PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════╗
║           🚍 CampusRide API Server              ║
╠══════════════════════════════════════════════════╣
║  Status:      Running                           ║
║  Port:        ${PORT}                              ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(33)}║
║  API:         http://localhost:${PORT}/api/v1       ║
╚══════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Unhandled errors
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Promise Rejection:', err);
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
