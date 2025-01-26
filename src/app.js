const express = require('express');
const config = require('./config/config');
const developmentMiddleware = require('./middleware/development');

const app = express();

// Load environment-specific middleware
developmentMiddleware(app);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure routes based on environment
app.use(config.api.prefix, require('./routes'));

// Error handling
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  const message = config.app.showErrors ? err.message : 'Internal Server Error';

  res.status(status).json({
    status: 'error',
    message,
    ...(config.app.showErrors && { stack: err.stack }),
  });
});

module.exports = app;
