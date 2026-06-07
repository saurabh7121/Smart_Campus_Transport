/**
 * CampusRide - Audit Service
 * Centralized audit logging for tracking important actions
 */

const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

/**
 * Create an audit log entry
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - Action name (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param {string} params.entity - Entity type (e.g., 'Student', 'Bus')
 * @param {string} params.entityId - ID of the affected entity
 * @param {string} params.description - Human-readable description
 * @param {Object} params.changes - { before, after } state
 * @param {Object} params.req - Express request object for IP/UA
 */
const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  description,
  changes,
  req,
  metadata,
}) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      entity,
      entityId,
      description,
      changes,
      ipAddress: req ? (req.ip || req.connection?.remoteAddress) : null,
      userAgent: req ? req.get('user-agent') : null,
      metadata,
    });
  } catch (error) {
    // Don't throw - audit logging should never break main flow
    logger.error('Failed to create audit log:', error.message);
  }
};

module.exports = { createAuditLog };
