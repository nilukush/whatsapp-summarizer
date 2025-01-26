const express = require('express');
const os = require('os');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get system health status
 *     responses:
 *       200:
 *         description: System health information
 */
router.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
    },
    cpu: os.cpus().length,
  };

  res.json(healthCheck);
});

module.exports = router;
