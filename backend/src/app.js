/**
 * CampusRide - Express Application Setup
 * Configures Express with all middleware and routes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { generalLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// ─── Security Middleware ────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Request Parsing ────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Rate Limiting ──────────────────────────────────────
app.use('/api', generalLimiter);

// ─── API Routes ─────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Root Route ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚍 CampusRide API v1.0.0',
    docs: '/api/v1/health',
    timestamp: new Date().toISOString(),
  });
});

// ─── Error Handling ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
