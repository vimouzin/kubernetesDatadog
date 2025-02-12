const express = require('express');
const axios = require('axios');
const winston = require('winston');
const { Client } = require('pg');

// Create a logger
const logger = winston.createLogger({
  level: 'info', // Set the minimum log level
  format: winston.format.combine(
    winston.format.timestamp(), // Adds a timestamp
    winston.format.json()       // Formats logs as JSON
  ),
  transports: [
    new winston.transports.Console() // Logs to the console
    // new winston.transports.File({ filename: 'app.log' }) // Logs to a file
  ]
});

// PostgreSQL connection details for Azure Flexible Server
const client = new Client({
    user: 'vimouzin',  // PostgreSQL username (ensure `@server-name` format)
    host: 'vitor-m.postgres.database.azure.com', // Azure PostgreSQL hostname
    database: 'user_database', // Your database name
    password: '', // Your PostgreSQL password
    port: 5432, // Default PostgreSQL port
    ssl: { rejectUnauthorized: false } // Required for Azure SSL connection
});

// Connect to PostgreSQL on startup
client.connect()
    .then(() => logger.info('Connected to Azure PostgreSQL'))
    .catch(err => logger.error('Failed to connect to PostgreSQL', err.stack));

// Express application setup
const app = express();
const port = 8080;

// Route to fetch a user from the database
app.get('/users', async (req, res) => {
  try {
      logger.info('Fetching all users from the database');
      const result = await client.query('SELECT * FROM users'); // Fetch all users

      logger.info(`Fetched ${result.rows.length} users`);
      res.json(result.rows);
  } catch (error) {
      logger.error('Database query failed', error.stack);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Root route
app.get('/', async (req, res) => {
    logger.info('This is a log correlated with traces');
    res.send('Successfully sent a trace and log');
});

// Start Express server
app.listen(port, () => {
    logger.info(`App is running at http://localhost:${port}`);
});
