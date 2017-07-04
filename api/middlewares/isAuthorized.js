"use strict";

/**
 *
 * @param {*} options permission options
 */
function isAuthorized(options) {
    return async (ctx, next) => {
        if (!ctx.state.user.role.includes('admin')) {
            if (!ctx.state.user.scope.includes(options.permission)) {
                return ctx.forbidden('you do not have required permissions');
            }
        }
        await next();
    };
}

module.exports = isAuthorized;
