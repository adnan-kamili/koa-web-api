"use strict";

const Logger = require('../services/Logger');

/**
 *
 * @param {*} options error handling options
 */
function httpResponses(options) {
    return async (ctx, next) => {
        ctx.ok = function (data, pagination) {
            this.status = 200;
            if (pagination) {
                this.set('Pagination-Count', pagination.count);
                this.set('Pagination-Page', pagination.page);
                this.set('Pagination-Limit', pagination.limit);
            }
            this.body = data;
        }
        ctx.created = function (location) {
            this.status = 201;
            this.set('Location', location);
            this.body = { message: 'Resource created successfully' };
            Logger.info("resource created");
        }
        ctx.noContent = function () {
            this.status = 204;
            this.body = null;
        }
        ctx.badRequest = function (message) {
            this.throw(400, message);
        }
        ctx.unauthorized = function (message) {
            this.throw(401, message);
        }
        ctx.forbidden = function (message) {
            this.throw(403, message);
        }
        ctx.notFound = function (message) {
            this.throw(404, message);
        }
        ctx.conflict = function (message) {
            this.throw(409, message);
        }
        await next();
    };
}

module.exports = httpResponses;
