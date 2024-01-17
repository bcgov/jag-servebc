const { format, createLogger, transports } = require("winston");

//const { combine, timestamp, label, printf } = format;
const { combine, timestamp, printf, colorize, align } = format;

//Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

/*
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(timestamp(), customFormat),
  transports: [new transports.Console()],
});
*/
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DDThh:mm:ss.SSSZ',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level} ${info.message}`)
  ),
  transports: [new transports.Console()],
});



module.exports = logger;