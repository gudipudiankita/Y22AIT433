// Custom logging middleware to be used throughout the app
// This logger will simulate logging functionality without using console.log or built-in loggers

class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, ...meta };
    this.logs.push(logEntry);
    // Here you could extend to send logs to a server or save in localStorage
  }

  info(message, meta) {
    this.log('INFO', message, meta);
  }

  warn(message, meta) {
    this.log('WARN', message, meta);
  }

  error(message, meta) {
    this.log('ERROR', message, meta);
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();

export default logger;
