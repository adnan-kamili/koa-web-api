'use strict';

const { User, Role } = require('../models');
const Validator = require('../services/Validator');

const exclude = ['password'];
const include = [{
    model: Role,
    as: 'roles',
    attributes: ['name']
}];


class UsersController {
    static async getUser(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        let user = await User.findOne({
            where: query,
            include: include,
            attributes: { exclude }
        });
        if (!user) {
            return ctx.notFound(`The user id '${ctx.params.id}' does not exist!`);
        }
        user = user.get({ plain: true });
        user.roles = user.roles.map(role => role.name);
        return ctx.ok(user);
    }
    static async getUsers(ctx) {
        const pagination = Validator.paginationAttributes(ctx.query);
        const offset = (pagination.page - 1) * pagination.limit;
        const query = { tenantId: ctx.state.user.tenantId };
        const result = await User.findAndCountAll({
            where: query,
            attributes: { exclude },
            include: include,
            offset: offset,
            limit: pagination.limit
        });
        const users = result.rows.map((user) => {
            user = user.get({ plain: true });
            user.roles = user.roles.map(role => role.name);
            return user;
        })
        pagination.count = result.count;
        return ctx.ok(users, pagination);
    }
    static async createUser(ctx) {
        const roleNames = ctx.request.body.roles || [];
        const roles = [];
        for (let roleName of roleNames) {
            roleName = roleName.toString().toLowerCase();
            if (roleName === 'admin') {
                return ctx.badRequest(`role '${roleName}' is not allowed!`);
            }
            const query = {
                name: roleName,
                tenantId: ctx.state.user.tenantId
            }
            const role = await Role.findOne({ where: query });
            if (!role) {
                return ctx.badRequest(`role '${roleName}' does not exist!`);
            }
            roles.push(role);
        }
        const user = User.build(ctx.request.body);
        user.lastLogin = new Date();
        user.tenantId = ctx.state.user.tenantId;
        await user.save();
        await user.addRoles(roles);
        return ctx.created(`/v1/users/${user.id}`);
    }
    static async updateUser(ctx) {
        const roleNames = ctx.request.body.roles;
        const roles = [];
        if (roleNames instanceof Array) {
            for (let roleName of roleNames) {
                roleName = roleName.toString().toLowerCase();
                if (roleName === 'admin') {
                    return ctx.badRequest(`role '${roleName}' is not allowed!`);
                }
                const query = {
                    name: roleName,
                    tenantId: ctx.state.user.tenantId
                }
                const role = await Role.findOne({ where: query });
                if (!role) {
                    return ctx.badRequest(`role '${roleName}' does not exist!`);
                }
                roles.push(role);
            }
        }

        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await User.findOne({ where: query });
        if (!user) {
            return ctx.notFound(`The user id '${ctx.params.id}' does not exist!`);
        }
        if (!ctx.state.user.role.includes('admin')) {
            // Only admin or current user can update current user's profile
            if (ctx.state.user.sub !== user.id) {
                return ctx.forbidden('you do not have permissions to update the user');
            }
        }
        await user.update(ctx.request.body, { fields: ['name'] });
        if (roleNames instanceof Array) {
            await user.setRoles(roles);
        }
        return ctx.noContent();
    }

    static async updatePassword(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await User.findOne({ where: query });
        if (!user) {
            return ctx.notFound(`The user id '${ctx.params.id}' does not exist!`);
        }
        if (!ctx.state.user.role.includes('admin')) {
            // Only admin or current user can update current user's profile
            if (ctx.state.user.sub !== user.id) {
                return ctx.forbidden('you do not have permissions to update the user');
            }
        }
        await user.update({ password: ctx.request.body.password });
        return ctx.noContent();
    }

    static async updateEmail(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await User.findOne({ where: query });
        if (!user) {
            return ctx.notFound(`The user id '${ctx.params.id}' does not exist!`);
        }
        if (!ctx.state.user.role.includes('admin')) {
            // Only admin or current user can update current user's profile
            if (ctx.state.user.sub !== user.id) {
                return ctx.forbidden('you do not have permissions to update the user');
            }
        }
        await user.update({ email: ctx.request.body.email });
        return ctx.noContent();
    }

    static async deleteUser(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await User.findOne({ where: query });
        if (!user) {
            return ctx.notFound(`The user id '${ctx.params.id}' does not exist!`);
        }
        const roles = await user.getRoles();
        if (roles.length) {
            for (const role of roles) {
                if (role.name === 'admin') {
                    return ctx.forbidden('admin user cannot be deleted');
                }
            }
        }
        await user.destroy();
        return ctx.noContent();
    }
}

module.exports = UsersController;

