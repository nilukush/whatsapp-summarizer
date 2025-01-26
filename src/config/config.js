const development = require('./environments/development');
const production = require('./environments/production');
const test = require('./environments/test');

const environments = {
  development,
  production,
  test,
};

const env = process.env.NODE_ENV || 'development';

module.exports = environments[env];
