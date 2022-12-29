import winston from 'winston';
import 'winston-daily-rotate-file';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const level = () => {
  //TODO: set env level
  // const env = process.env.NODE_ENV || 'development'
  // const isDevelopment = env === 'development'
  return 'debug';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  verbose: 'green',
  debug: 'white',
  silly: 'underline magenta whiteBG',
};

winston.addColors(colors);

const transport = new winston.transports.DailyRotateFile({
  filename: 'UA-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  auditFile: 'auditFile',
  dirname: './logs',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => {
      const { timestamp, level: loglevel, message, ...args } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${loglevel}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`;
    })
  ),
});

const Logger = winston.createLogger({
  level: level(),
  levels,
  transports: [transport, consoleTransport],
});

export default Logger;
