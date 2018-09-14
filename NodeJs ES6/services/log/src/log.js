import winston from 'winston';

const logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            name :            'info-file',
            level:            'info',
            filename:         './logs/all-logs.log',
            handleExceptions: true,
            json:             false,
            maxsize:          5242880, //5MB
            maxFiles:         10,
            colorize:         false
        }),
            new winston.transports.File({
                name :            'error-file',
                level:            'error',
                filename:         './logs/error-logs.log',
                handleExceptions: true,
                json:             false,
                maxsize:          5242880, //5MB
                maxFiles:         5,
                colorize:         false
            })
    ],
    exitOnError: false
});


logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

export default logger;

