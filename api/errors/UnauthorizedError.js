'use strict';

/**
 * Custom Error class for authentication error
 *
 * @class UnauthorizedError
 * @extends {Error}
 */
class UnauthorizedError extends Error {

    /**
     * Creates an instance of UnauthorizedError.
     * @param {string} message Error message
     *
     */
    constructor(message) {
        super();
        this.status = 401;
        this.message = message;
    }
}

module.exports = UnauthorizedError;
