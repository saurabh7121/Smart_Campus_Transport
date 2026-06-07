/**
 * CampusRide - Request Validation Middleware
 * Uses Joi schemas to validate request body, params, and query
 */

const ApiError = require('../utils/ApiError');

/**
 * Validate request against a Joi schema
 * @param {Object} schema - Joi schema object with body, params, query keys
 * @returns {Function} Express middleware
 * 
 * Usage: validate({ body: loginSchema })
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    ['body', 'params', 'query'].forEach((key) => {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
          errors: { wrap: { label: '' } },
        });

        if (error) {
          error.details.forEach((detail) => {
            errors.push({
              field: detail.path.join('.'),
              message: detail.message,
            });
          });
        } else {
          // Replace with validated & sanitized values
          req[key] = value;
        }
      }
    });

    if (errors.length > 0) {
      throw ApiError.badRequest('Validation failed', errors);
    }

    next();
  };
};

module.exports = validate;
