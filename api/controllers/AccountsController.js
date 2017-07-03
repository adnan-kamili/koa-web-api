'use strict';

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

    // static async sendPasswordResetLink(ctx) {

    // }

    // static async resetPassword(ctx) {

    // }
}

module.exports = AccountsController;

