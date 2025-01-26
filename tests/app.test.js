const request = require('supertest');
const app = require('../src/app'); // We'll create this next

describe('App Tests', () => {
  test('GET / - should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
