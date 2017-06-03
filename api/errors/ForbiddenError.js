'use strict';

/**
 * Custom Error class for access to resource forbidden error
 *
 * @class ForbiddenError
 * @extends {Error}
 */
class ForbiddenError extends Error {

    /**
     * Creates an instance of ForbiddenError.
     * @param {string} message Error message
     *
     */
    constructor(message) {
        super();
        this.status = 403;
        this.message = message;
    }
}

module.exports = ForbiddenError;
