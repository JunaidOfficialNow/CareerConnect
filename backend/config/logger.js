const winston =  require('winston');


module.exports.logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || 'info',
  format: winston.format.combine(
    winston.format.timestamp({format: 'DD/MM - HH:mm:ss'}),
    winston.format.colorize({all: true}),
    winston.format.metadata({fillExcept: ['timestamp', 'message', 'level']}),
    winston.format.printf(({ timestamp, level, message }) => {
     return `[${timestamp}] [${level}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
  ]
})