const winston = require('winston')
const { LoggingWinston } = require('@google-cloud/logging-winston')

const loggingWinston = new LoggingWinston()

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/winston_log"
exports.logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    loggingWinston
  ]
})
