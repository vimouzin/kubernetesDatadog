const tracer = require('dd-trace').init({
    service: process.env.DD_SERVICE || 'nodeapp',
    env: process.env.DD_ENV || 'development',
    version: process.env.DD_VERSION || '1.0.0',
    logInjection: true, // Enables trace-log correlation
    debug: true
});
const express = require('express');
const axios = require('axios');
const winston = require('winston');

// Create a logger
const logger = winston.createLogger({
  level: 'info', // Set the minimum log level
  format: winston.format.combine(
    winston.format.timestamp(), // Adds a timestamp
    winston.format.json()       // Formats logs as JSON
  ),
  transports: [
    new winston.transports.Console(), // Logs to the console
    new winston.transports.File({ filename: 'app.log' }) // Logs to a file
  ]
});

// Express application setup
const app = express();
const port = 8080;

app.get('/', async (req, res) => {
    // Log with correlation
    logger.info('This is a log correlated with traces');

    res.send('Successfully sent a trace and log');

});

app.listen(port, () => {
    logger.info(`App is running at http://localhost:${port}`);
});
