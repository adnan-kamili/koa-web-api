'use strict';

const { User } = require('../models');
const Validator = require('../services/Validator');

class UsersController {
    static async getUser(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const exclude = ['password'];
        const user = await User.findOne({
            where: query,
            attributes: { exclude }
        });
        if (!user) {
            return ctx.notFound(`The user id '${ctx.params.id}' does not exist!`);
        }
        return ctx.ok(user);
    }
    static async getUsers(ctx) {
        const pagination = Validator.paginationAttributes(ctx.query);
        const offset = (pagination.page - 1) * pagination.limit;
        const query = { tenantId: ctx.state.user.tenantId };
        const exclude = ['password'];
        const result = await User.findAndCountAll({
            where: query,
            attributes: { exclude },
            offset: offset,
            limit: pagination.limit
        });
        pagination.count = result.count;
        return ctx.ok(result.rows, pagination);
    }
    static async createUser(ctx) {
        const user = User.build(ctx.request.body)
        user.lastLogin = new Date();
        user.tenantId = ctx.state.user.tenantId;
        await user.save();
        return ctx.created(`/v1/users/${user.id}`);
    }
    static async updateUser(ctx) {
        return ctx.noContent();
    }
    static async deleteUser(ctx) {
        return ctx.noContent();
    }
}

module.exports = UsersController;
