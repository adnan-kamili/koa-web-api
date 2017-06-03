'use strict';

/**
 * Custom Error class for resource not found error
 *
 * @class NotFoundError
 * @extends {Error}
 */
class NotFoundError extends Error {

    /**
     * Creates an instance of NotFoundError.
     * @param {string} message Error message
     *
     */
    constructor(message) {
        super();
        this.status = 404;
        this.message = message;
    }
}

module.exports = NotFoundError;
