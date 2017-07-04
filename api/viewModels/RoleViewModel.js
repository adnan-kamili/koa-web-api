'use strict';

const Joi = require('joi');

const RoleCreateViewModel = {
    name: Joi.string().required().max(256),
    description: Joi.string().required().max(256),
    claims: Joi.array().items(Joi.string())
};

const RoleUpdateViewModel = {
    name: Joi.string().max(256),
    description: Joi.string().max(256),
    claims: Joi.array().items(Joi.string())
};

module.exports = {
    RoleCreateViewModel,
    RoleUpdateViewModel
};
