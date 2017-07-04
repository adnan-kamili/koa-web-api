'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const jwtConfig = config.get('jwt');
const Mailer = require('../services/Mailer');
const Validator = require('../services/Validator');

const { User, Role, Tenant, sequelize } = require('../models');
const { RegisterViewModel, ResetPasswordViewModel, EmailViewModel } = require('../viewModels/AccountViewModel');


class AccountsController {
    static async createAccount(ctx) {
        const viewModel = Validator.validate(ctx.request.body, RegisterViewModel);
        await sequelize.transaction(async (transaction) => {
            const tenant = await Tenant.create({ company: viewModel.company }, { transaction: transaction });
            const user = User.build(viewModel);
            user.lastLogin = new Date();
            user.tenantId = tenant.id;
            await user.save({ transaction: transaction });
            const role = await Role.create({
                name: 'admin',
                description: 'admin role',
                tenantId: tenant.id
            }, { transaction: transaction });
            await user.addRole(role, { transaction: transaction });
            return ctx.created(`/v1/users/${user.id}`);
        });
    }

    static async sendPasswordResetLink(ctx) {
        const viewModel = Validator.validate(ctx.request.body, EmailViewModel);
        const query = { email: viewModel.email }
        const user = await User.findOne({ where: query });
        if (user) {
            const payload = {
                email: user.email,
                usage: 'password_reset_token'
            };
            const token = jwt.sign(payload, user.password, { expiresIn: jwtConfig.expiry });
            const url = `http://app.example.com/reset-password?token=${token}`;
            const message = `<a href="${url}">Click to reset password!</a>`;
            await Mailer.sendEmail(user.email, "Password reset request", message);
        }
        return ctx.noContent();
    }

    static async resetPassword(ctx) {
        const viewModel = Validator.validate(ctx.request.body, ResetPasswordViewModel);
        const query = { email: viewModel.email }
        const user = await User.findOne({ where: query });
        if (!user) {
            return ctx.badRequest('email does not exist!');
        }
        try {
            const decoded = jwt.verify(viewModel.token, user.password);
            if (user.email !== decoded.email) {
                return ctx.badRequest('invalid token!');
            }
        } catch (err) {
            return ctx.badRequest('invalid token!');
        }
        await user.update({ password: viewModel.password });
        return ctx.noContent();
    }
}

module.exports = AccountsController;

