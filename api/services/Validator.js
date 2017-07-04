'use strict';

const Joi = require('joi');

const paginationSchema = {
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
};

const validate = function (attributes, schema) {
    const { error, value } = Joi.validate(attributes, schema);
    if (error) {
        const validationError = new Error(error.details[0].message);
        validationError.status = 400;
        throw validationError;
    }
    return value;
};
module.exports = {
    paginationAttributes: function (attributes) {
        attributes.page = attributes.page || 1;
        attributes.limit = attributes.limit || 10;
        return validate(attributes, paginationSchema);
    }
};
