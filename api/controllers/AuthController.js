'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');
const jwtConfig = config.get('jwt');

const { User, Role, RoleClaim } = require('../models');
const include = [{
    model: Role,
    as: 'roles',
    attributes: ['name'],
    include: [{
        model: RoleClaim,
        as: 'claims',
        attributes: ['claimValue']
    }]
}];

class AuthController {
    static async createToken(ctx) {
        const query = { email: ctx.request.body.username }
        const user = await User.findOne({
            where: query,
            include: include
        });
        if (!user) {
            return ctx.unauthorized('invalid email or password!');
        }
        const matched = await user.comparePassword(ctx.request.body.password);
        if (!matched) {
            return ctx.unauthorized('invalid email or password!');
        }
        const roles = user.get({ plain: true }).roles.map(role => role.name);
        const payload = {
            sub: user.id,
            role: roles,
            tenantId: user.tenantId,
            usage: "access_token"
        };
        if (!roles.includes('admin')) {
            payload.scope = [];
            for (const role of user.roles) {
                const claims = role.get({ plain: true }).claims.map(claim => claim.claimValue);
                payload.scope.push(...claims);
            }
        }
        const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiry });
        await user.update({ lastLogin: new Date() });
        return ctx.ok({ access_token: token, expires_in: jwtConfig.expiry });
    }
}

module.exports = AuthController;

