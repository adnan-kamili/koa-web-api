'use strict';

const Joi = require('joi');

const LoginViewModel = {
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required()
};

module.exports = { LoginViewModel };
