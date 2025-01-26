const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
app.use(cors({
  exposedHeaders: ['x-request-id']
}));
// Add this line after initializing Express
app.use(express.json()); // Parse JSON bodies

const logger = require('./config/logger');
// Add startup logging
logger.info('Starting server...');
logger.info('Environment:', process.env.NODE_ENV);
logger.info('Port:', process.env.PORT);

// Add error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
});

// WhatsApp OAuth Configuration
const WA_CLIENT_ID = process.env.WA_CLIENT_ID;
const WA_CLIENT_SECRET = process.env.WA_CLIENT_SECRET;
const REDIRECT_URI = 'https://whatsapp-summarizer-backend-73qq9.ondigitalocean.app/auth/callback';

// Step 1: Redirect users to WhatsApp OAuth
app.get('/auth/whatsapp', (req, res) => {
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${WA_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=whatsapp_business_management`;
  res.redirect(authUrl);
});

// Step 2: Handle OAuth callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${WA_CLIENT_ID}&client_secret=${WA_CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`
    );
    const accessToken = data.access_token;
    logger.info(`Access token: ${accessToken}`);
    // Store token securely (e.g., in Redis)
    res.send('Authentication successful!');
  } catch (error) {
    res.status(500).send('Authentication failed.');
  }
});

// Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verify token matches your .env value
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403); // Reject if tokens don't match
  }
});

// Handle Messages (POST)
app.post('/webhook', async (req, res) => {
  try {
    console.log('Incoming payload:', req.body); // Log the parsed body

    // Validate payload structure
    if (!req.body?.entry?.[0]?.changes?.[0]) {
      throw new Error('Invalid payload structure');
    }

    const entry = req.body.entry[0];
    const changes = entry.changes[0];

    if (changes.field === 'messages') {
      const message = changes.value.messages?.[0];
      if (message) {
        console.log('Storing message:', message.id);
        const { error } = await supabase
          .from('message_queue')
          .insert([{ content: message }]);
        if (error) throw error;
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.sendStatus(500);
  }
});

app.post('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('message_queue')
      .insert([{ content: { id: "test", text: "Hello" } }]);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Test Supabase error:', error);
    res.status(500).send(error.message);
  }
});

// Start server
const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  logger.info(`Server is running on port ${server.address().port}`);
});
