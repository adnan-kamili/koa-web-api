import { Controller, Param, Body, Get, Post, Put, Patch, Delete, NotFoundError, ForbiddenError } from "routing-controllers";
import { HttpCode, Authorized, Ctx, QueryParam, UseAfter, BadRequestError } from "routing-controllers";
import { hash, compare } from 'bcryptjs';
import { PermissionClaims } from '../policies/PermissionClaims';
import { PaginationHeader } from '../middlewares/PaginationHeader';
import { Repository } from '../repository/Repository';
import { User } from '../models/User';
import { Role } from '../models/Role';

import { UserViewModel } from '../viewModels/UserViewModel';
import { EmailViewModel } from '../viewModels/EmailViewModel';
import { PasswordViewModel } from '../viewModels/PasswordViewModel';

const join = {
    alias: "user",
    leftJoinAndSelect: {
        roles: "user.roles"
    }
}

@Controller("/users")
export class UsersController {
    userRepository: any;
    roleRepository: any;

    constructor(private repository: Repository) {
        this.userRepository = repository.getRepository(User);
        this.roleRepository = repository.getRepository(Role);
    }

    @Get()
    @Authorized(PermissionClaims.readUser)
    @UseAfter(PaginationHeader)
    async getAll( @Ctx() ctx: any, @QueryParam("limit") limit = 10, @QueryParam("page") page = 1) {
        page = (page < 0) ? 1 : page;
        limit = (limit < 0) ? 0 : limit;
        limit = (limit > 100) ? 100 : limit;
        const offset = (page - 1) * limit;
        const [users, count] = await this.userRepository.findAndCount({
            where: { tenantId: ctx.state.user.tenantId },
            join: join,
            limit: limit,
            offset: offset
        });
        ctx.state.pagination = { page, limit, count };
        users.map((user: any) => {
            user.roles = user.roles.map((role: any) => role.name);
            return user;
        });
        return users;
    }

    @Get("/:id")
    @Authorized(PermissionClaims.readUser)
    async get( @Ctx() ctx: any, @Param("id") id: number) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await this.userRepository.findOne({
            where: query,
            join: join,
        });
        if (!user) {
            throw new NotFoundError(`user id '${ctx.params.id}' does not exist!`);
        }
        user.roles = user.roles.map((role: any) => role.name);
        return user;
    }

    @Post()
    @Authorized(PermissionClaims.readUser)
    @HttpCode(201)
    async create( @Ctx() ctx: any, @Body() viewModel: UserViewModel) {
        const user = this.userRepository.create(viewModel);
        user.tenantId = ctx.state.user.tenantId;
        user.lastLogin = new Date();
        user.password = await hash(viewModel.password, 10);
        user.roles = [];
        const roleNames = viewModel.roles || [];
        for (const roleName of roleNames) {
            if (roleName === 'admin') {
                throw new BadRequestError(`role '${roleName}' is not allowed!`);
            }
            const query = {
                name: roleName,
                tenantId: ctx.state.user.tenantId
            }
            const role = await this.roleRepository.findOne({ where: query });
            if (!role) {
                throw new BadRequestError(`role '${roleName}' does not exist!`);
            }
            user.roles.push(role);
        }
        await this.userRepository.persist(user);
        return { message: "created user" };
    }

    @Patch("/:id")
    @Authorized(PermissionClaims.readUser)
    @HttpCode(204)
    async update( @Ctx() ctx: any, @Param("id") id: number, @Body() viewModel: UserViewModel) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await this.userRepository.findOne({
            where: query,
            join: join
        });
        if (!user) {
            throw new NotFoundError(`user id '${ctx.params.id}' does not exist!`);
        }

        const roleNames = viewModel.roles;
        if (roleNames) {
            user.roles = [];
            for (const roleName of roleNames) {
                if (roleName === 'admin') {
                    throw new BadRequestError(`role '${roleName}' is not allowed!`);
                }
                const query = {
                    name: roleName,
                    tenantId: ctx.state.user.tenantId
                }
                const role = await this.roleRepository.findOne({ where: query });
                if (!role) {
                    throw new BadRequestError(`role '${roleName}' does not exist!`);
                }
                user.roles.push(role);
            }
        }

        if (!ctx.state.user.role.includes('admin')) {
            // Only admin or current user can update current user's profile
            if (ctx.state.user.sub !== user.id) {
                throw new ForbiddenError('you do not have permissions to update the user');
            }
        }
        if (viewModel.name) {
            user.name = viewModel.name;
        }
        await this.userRepository.persist(user);
    }

    @Put("/:id/password")
    @Authorized(PermissionClaims.readUser)
    @HttpCode(204)
    async updatePassword( @Ctx() ctx: any, @Param("id") id: number, @Body() viewModel: PasswordViewModel) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await this.userRepository.findOne({ where: query });
        if (!user) {
            throw new NotFoundError(`user id '${ctx.params.id}' does not exist!`);
        }

        if (!ctx.state.user.role.includes('admin')) {
            // Only admin or current user can update current user's profile
            if (ctx.state.user.sub !== user.id) {
                throw new ForbiddenError('you do not have permissions to update the user');
            }
        }
        const matched = await compare(viewModel.password, user.password);
        if (!matched) {
            throw new BadRequestError(`incorrect password!`);
        }
        user.password = await hash(viewModel.newPassword, 10);
        await this.userRepository.persist(user);
    }

    @Put("/:id/email")
    @Authorized(PermissionClaims.readUser)
    @HttpCode(204)
    async updateEmail( @Ctx() ctx: any, @Param("id") id: number, @Body() viewModel: EmailViewModel) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await this.userRepository.findOne({ where: query });
        if (!user) {
            throw new NotFoundError(`user id '${ctx.params.id}' does not exist!`);
        }

        if (!ctx.state.user.role.includes('admin')) {
            // Only admin or current user can update current user's profile
            if (ctx.state.user.sub !== user.id) {
                throw new ForbiddenError('you do not have permissions to update the user');
            }
        }
        user.email = viewModel.email;
        await this.userRepository.persist(user);
    }

    @Delete("/:id")
    @Authorized(PermissionClaims.deleteUser)
    @HttpCode(204)
    async delete( @Ctx() ctx: any, @Param("id") id: number) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const user = await this.userRepository.findOne({
            where: query,
            join: join
        });
        if (!user) {
            throw new NotFoundError(`user id '${ctx.params.id}' does not exist!`);
        }
        if (user.roles.length) {
            for (const role of user.roles) {
                if (role.name === 'admin') {
                    throw new ForbiddenError('admin user cannot be deleted');
                }
            }
        }
        await this.roleRepository.remove(user);
    }

}