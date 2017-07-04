'use strict';

const Joi = require('joi');

const UserCreateViewModel = {
    name: Joi.string().required().max(256),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6).max(72),
    roles: Joi.array().items(Joi.string().lowercase()).max(10)
};

const UserUpdateViewModel = {
    name: Joi.string().max(256),
    roles: Joi.array().items(Joi.string().lowercase()).max(10)
};

module.exports = {
    UserCreateViewModel,
    UserUpdateViewModel
};
