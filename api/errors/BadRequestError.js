'use strict';

/**
 * Custom Error class for invalid request errors
 *
 * @class BadRequestError
 * @extends {Error}
 */
class BadRequestError extends Error {

    /**
     * Creates an instance of BadRequestError.
     * @param {string} message Error message
     *
     */
    constructor(message) {
        super();
        this.status = 400;
        this.message = message;
    }
}

module.exports = BadRequestError;
