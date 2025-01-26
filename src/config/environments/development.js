module.exports = {
  app: {
    port: process.env.PORT || 3000,
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  logging: {
    level: 'debug',
    filePath: 'logs/development.log',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtExpiration: '1d',
  },
  api: {
    prefix: '/api/v1',
  },
};
