"use strict";

const Logger = require('../services/Logger');

/**
 *
 * @param {*} options error handling options
 */
function errorHandler(options) {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            ctx.status = error.status || 500;
            ctx.body = error;//{ message: error.message };
            if (ctx.status === 500) {
                Logger.error(error.message, error);
            } else {
                Logger.info(error.message);
            }
        }
    };
}

module.exports = errorHandler;
