module.exports = {
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js', '!**/node_modules/**'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['dotenv/config'],
};
