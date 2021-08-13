const { createLogger, format, transports } = require('winston')
const { combine, timestamp, simple } = format

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        simple()
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;
