'use strict';

const Joi = require('joi');

const RegisterViewModel = {
    name: Joi.string().required().max(256),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6).max(72),
    company: Joi.string().required().max(256)
};

const ResetPasswordViewModel = {
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6).max(72),
    token: Joi.string().required()
};

const EmailViewModel = { email: Joi.string().required().email().lowercase() };

module.exports = {
    RegisterViewModel,
    ResetPasswordViewModel,
    EmailViewModel
};
