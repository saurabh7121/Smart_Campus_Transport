/**
 * CampusRide - Standardized API Response
 * Ensures consistent response format across all endpoints
 */

class ApiResponse {
  constructor(statusCode, message = 'Success', data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success(data = null, message = 'Success') {
    return new ApiResponse(200, message, data);
  }

  static created(data = null, message = 'Created successfully') {
    return new ApiResponse(201, message, data);
  }

  static noContent(message = 'Deleted successfully') {
    return new ApiResponse(204, message);
  }

  /**
   * Send the response via Express res object
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
