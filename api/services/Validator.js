'use strict';

const Joi = require('joi');

const paginationSchema = {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
};
class Validator {
    static validate(attributes, schema) {
        const { error, value } = Joi.validate(attributes, schema);
        if (error) {
            const validationError = new Error(error.details[0].message);
            validationError.status = 400;
            throw validationError;
        }
        return value;
    }

    static validatePaginationQuery(attributes) {
        const { error, value } = Joi.validate(attributes, paginationSchema);
        if (error) {
            const validationError = new Error(error.details[0].message);
            validationError.status = 400;
            throw validationError;
        }
        return value;
    }
}
module.exports = Validator
