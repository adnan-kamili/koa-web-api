'use strict';

const { Role, RoleClaim } = require('../models');
const { RoleCreateViewModel, RoleUpdateViewModel } = require('../viewModels/RoleViewModel');
const Validator = require('../services/Validator');
const PermissionClaims = require('../policies/PermissionClaims');
const ClaimTypes = require('../policies/ClaimTypes');

const include = [{
    model: RoleClaim,
    as: 'claims',
    attributes: ['claimValue']
}];

class RolesController {
    static async getRole(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        let role = await Role.findOne({
            where: query,
            include: include
        });
        if (!role) {
            return ctx.notFound(`The role id '${ctx.params.id}' does not exist!`);
        }
        role = role.get({ plain: true });
        role.claims = role.claims.map(claim => claim.claimValue);
        return ctx.ok(role);
    }

    static async getRoles(ctx) {
        const pagination = Validator.validatePaginationQuery(ctx.query);
        const offset = (pagination.page - 1) * pagination.limit;
        const query = { tenantId: ctx.state.user.tenantId };
        const result = await Role.findAndCountAll({
            where: query,
            include: include,
            offset: offset,
            limit: pagination.limit
        });
        const roles = result.rows.map((role) => {
            role = role.get({ plain: true });
            role.claims = role.claims.map(claim => claim.claimValue);
            return role;
        });
        pagination.count = result.count;
        return ctx.ok(roles, pagination);
    }

    static async createRole(ctx) {
        const viewModel = Validator.validate(ctx.request.body, RoleCreateViewModel);
        const claims = viewModel.claims || [];
        const claimValues = Object.values(PermissionClaims);
        for (const claim of claims) {
            if (!claimValues.includes(claim)) {
                return ctx.badRequest(`claim ${claim} does not exist`);
            }
        }
        const role = Role.build(viewModel);
        role.tenantId = ctx.state.user.tenantId;
        await role.save();
        const claimPromises = []
        for (const claim of claims) {
            claimPromises.push(RoleClaim.create({
                claimType: ClaimTypes.permission,
                claimValue: claim,
                roleId: role.id
            }));
        }
        await Promise.all(claimPromises);
        return ctx.created(`/v1/roles/${role.id}`);
    }

    static async updateRole(ctx) {
        const viewModel = Validator.validate(ctx.request.body, RoleUpdateViewModel);
        const claims = viewModel.claims;
        const claimValues = Object.values(PermissionClaims);
        if (claims) {
            for (const claim of claims) {
                if (!claimValues.includes(claim)) {
                    return ctx.badRequest(`claim '${claim}' does not exist`);
                }
            }
        }

        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const role = await Role.findOne({ where: query });
        if (!role) {
            return ctx.notFound(`The role id '${ctx.params.id}' does not exist!`);
        }
        if (role.name === 'admin') {
            return ctx.forbidden('admin role cannot be updated');
        }
        await role.update(viewModel);
        if (claims) {
            await RoleClaim.destroy({ where: { roleId: role.id } });
            const claimPromises = []
            for (const claim of claims) {
                claimPromises.push(RoleClaim.create({
                    claimType: ClaimTypes.permission,
                    claimValue: claim,
                    roleId: role.id
                }));
            }
            await Promise.all(claimPromises);
        }
        return ctx.noContent();
    }

    static async deleteRole(ctx) {
        const query = {
            id: ctx.params.id,
            tenantId: ctx.state.user.tenantId
        }
        const role = await Role.findOne({ where: query });
        if (!role) {
            return ctx.notFound(`The role id '${ctx.params.id}' does not exist!`);
        }
        if (role.name === 'admin') {
            return ctx.forbidden('admin role cannot be deleted');
        }
        const users = await role.getUsers();
        if (users.length) {
            return ctx.conflict("Role is in use. Please delete the user first")
        }
        await role.destroy();
        return ctx.noContent();
    }
}

module.exports = RolesController;
