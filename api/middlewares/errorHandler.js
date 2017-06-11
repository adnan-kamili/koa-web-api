"use strict";

const Sequelize = require('sequelize');
const Logger = require('../services/Logger');

/**
 *
 * @param {*} options error handling options
 */
function errorHandler(options) {
    return async (ctx, next) => {
        try {
            ctx.state.user = { tenantId: 1 };
            await next();
        } catch (error) {
            if (error instanceof Sequelize.ValidationError) {
                error = sequelizeErrorFormatter(error);
            }
            ctx.status = error.status || 500;
            ctx.body = { message: error.message };
            if (ctx.status === 500) {
                Logger.error(error.message, error);
            } else {
                Logger.info(error.message);
            }
        }
    };
}

/**
 *
 * @param {*} error error object
 */
function sequelizeErrorFormatter(error) {
    const validationError = new Error(error.errors[0].message);
    validationError.status = 400;
    return validationError;
}

module.exports = errorHandler;
