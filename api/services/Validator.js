'use strict';

const validate = require('validate.js');

const Constraints = {
    pagination: function () {
        const constraint = {
            page: {
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0,
                    strict: true
                }
            },
            limit: {
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0,
                    lessThanOrEqualTo: 100,
                    strict: true
                }
            }
        };
        return constraint;
    }
};

const getCleanAttributes = function (attributes, constraints) {
    attributes = validate.cleanAttributes(attributes, constraints);
    const errors = validate(attributes, constraints, { format: "flat" });
    if (errors) {
        const validationError = new Error(errors[0].toLowerCase());
        validationError.status = 400;
        throw validationError;
    }
    return attributes;
};
module.exports = {
    paginationAttributes: function (attributes) {
        attributes.page = attributes.page || 1;
        attributes.limit = attributes.limit || 10;
        return getCleanAttributes(attributes, Constraints.pagination());
    }
};
