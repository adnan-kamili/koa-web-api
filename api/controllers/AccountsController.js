'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const jwtConfig = config.get('jwt');
const Mailer = require('../services/Mailer');
const { User, Role, Tenant, sequelize } = require('../models');


class AccountsController {
    static async createAccount(ctx) {
        await sequelize.transaction(async (transaction) => {
            const tenant = await Tenant.create(ctx.request.body, {
                fields: ['company'],
                transaction: transaction
            });
            const user = User.build(ctx.request.body);
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
        const query = { email: ctx.request.body.email }
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
        const query = { email: ctx.request.body.email }
        const user = await User.findOne({ where: query });
        if (!user) {
            return ctx.badRequest('email does not exist!');
        }
        try {
            const decoded = jwt.verify(ctx.request.body.token, user.password);
            if (user.email !== decoded.email) {
                return ctx.badRequest('invalid token!');
            }
        } catch (err) {
            return ctx.badRequest('invalid token!');
        }
        await user.update({ password: ctx.request.body.password });
        return ctx.noContent();
    }
}

module.exports = AccountsController;

