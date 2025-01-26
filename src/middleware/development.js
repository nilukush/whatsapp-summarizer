const morgan = require('morgan');
const logger = require('../config/logger');

const developmentMiddleware = app => {
  if (process.env.NODE_ENV === 'development') {
    // Add morgan middleware for HTTP request logging
    app.use(morgan('dev'));

    // Development-specific error handling
    app.use((err, req, res, _next) => {
      logger.error(err.stack);
      res.status(err.status || 500).json({
        error: {
          message: err.message,
          stack: err.stack,
          timestamp: new Date().toISOString(),
        },
      });
    });
  }
};

module.exports = developmentMiddleware;
