"use strict";

const fs = require('fs');
const config = require('config');
const winston = require('winston');
require('winston-daily-rotate-file');

const loggerConfig = config.get('logger');

// Create the logs folder
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

/**
 * Logger initialized to log to info & error log files
 */
const transports = [
    new winston.transports.DailyRotateFile({
        name: 'error-file',
        filename: 'logs/error.log',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        level: 'error',
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        // 10 MB max file size then rotate
        maxsize: 10485760
    }),
    new winston.transports.DailyRotateFile({
        name: 'info-file',
        filename: 'logs/info.log',
        level: loggerConfig.level,
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        // 10 MB max file size then rotate
        maxsize: 10485760
    })
]

// Enable console log
if (loggerConfig.console) {
    transports.push(new winston.transports.Console({
        colorize: true,
        level: loggerConfig.level
    }))
}
const logger = new winston.Logger({ transports: transports });

/**
 * Utility class for logging
 *
 * @class Logger
 */
class Logger {

    /**
     * Logs Info messages
     *
     * @param {object} args multiple info args
     * @returns {void}
     */
    static info(...args) {
        logger.info(...args);
    }

    /**
     * Logs error messages
     *
     * @param {object} args multiple error args
     * @returns {void}
     */
    static error(...args) {
        logger.error(...args);
    }
}

module.exports = Logger;
