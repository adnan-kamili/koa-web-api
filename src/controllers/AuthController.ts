import { Controller, Body, Post, Ctx, UnauthorizedError } from "routing-controllers";
import { compare } from 'bcryptjs';
import { Repository } from '../repository/Repository';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { LoginViewModel } from '../viewModels/LoginViewModel';

const jwt = require('jsonwebtoken');
const config = require('config');
const jwtConfig = config.get('jwt');

@Controller("/auth")
export class AuthController {

    userRepository: any;
    roleRepository: any;

    constructor(private repository: Repository) {
        this.userRepository = repository.getRepository(User);
        this.roleRepository = repository.getRepository(Role);
    }

    @Post("/token")
    async createToken( @Ctx() ctx: any, @Body() viewModel: LoginViewModel) {
        const query = { email: viewModel.email };
        const user = await this.userRepository.findOne({
            where: query,
            join: {
                alias: "user",
                leftJoinAndSelect: {
                    roles: "user.roles",
                    claims: "roles.claims"
                }
            }
        });
        if (!user) {
            throw new UnauthorizedError("invalid email or password!");
        }
        const matched = await compare(viewModel.password, user.password);
        if (!matched) {
            throw new UnauthorizedError("invalid email or password!");
        }
        const roles = user.roles.map((role: Role) => role.name);
        const payload = {
            sub: user.id,
            role: roles,
            tenantId: user.tenantId,
            usage: "access_token",
            scope: new Array()
        };
        if (!roles.includes('admin')) {
            for (const role of user.roles) {
                const claims = role.claims.map((claim: any) => claim.claimValue);
                payload.scope.push(...claims);
            }
        }
        const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiry });
        user.lastLogin = new Date();
        await this.userRepository.persist(user);
        return { access_token: token, expires_in: jwtConfig.expiry };
    }
}