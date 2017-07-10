import { Controller, Param, Body, Get, Post, Patch, Delete, ForbiddenError, HttpError } from "routing-controllers";
import { HttpCode, Authorized, Ctx, QueryParam, UseAfter, BadRequestError, NotFoundError } from "routing-controllers";
import { RoleViewModel } from '../viewModels/RoleViewModel';
import { PermissionClaims } from '../policies/PermissionClaims';
import { ClaimTypes } from '../policies/ClaimTypes';
import { PaginationHeader } from '../middlewares/PaginationHeader';
import { Repository } from '../repository/Repository';
import { User } from '../models/User';
import { Role } from '../models/Role';

const join = {
    alias: "role",
    leftJoinAndSelect: {
        claims: "role.claims"
    }
}


@Controller("/roles")
export class RolesController {
    roleRepository: any;

    constructor(private repository: Repository) {
        this.roleRepository = repository.getRepository(Role);
    }

    @Get()
    @Authorized(PermissionClaims.readRole)
    @UseAfter(PaginationHeader)
    async getAll( @Ctx() ctx: any, @QueryParam("limit") limit = 10, @QueryParam("page") page = 1) {
        page = (page < 0) ? 1 : page;
        limit = (limit < 0) ? 0 : limit;
        limit = (limit > 100) ? 100 : limit;
        const offset = (page - 1) * limit;
        const [roles, count] = await this.roleRepository.findAndCount({
            where: { tenantId: ctx.state.user.tenantId },
            join: join,
            limit: limit,
            offset: offset
        });
        ctx.state.pagination = { page, limit, count };
        roles.map((role: any) => {
            role.claims = role.claims.map((claim: any) => claim.claimValue);
            return role;
        });
        return roles;
    }

    @Get("/:id")
    @Authorized(PermissionClaims.readRole)
    async get( @Ctx() ctx: any, @Param("id") id: number) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const role = await this.roleRepository.findOne({
            where: query,
            join: join
        });
        if (!role) {
            throw new NotFoundError(`role id '${ctx.params.id}' does not exist!`);
        }
        role.claims = role.claims.map((claim: any) => claim.claimValue);
        return role;
    }

    @Post()
    @Authorized(PermissionClaims.readRole)
    @HttpCode(201)
    async create( @Ctx() ctx: any, @Body() viewModel: RoleViewModel) {
        const role = this.roleRepository.create(viewModel);
        role.tenantId = ctx.state.user.tenantId;
        role.claims = [];
        const claims = viewModel.claims || [];
        const claimValues = Object.values(PermissionClaims);
        for (const claim of claims) {
            if (!claimValues.includes(claim)) {
                throw new BadRequestError(`claim '${claim}' does not exist`);
            }
            role.claims.push({
                claimType: ClaimTypes.permission,
                claimValue: claim
            })
        }
        await this.roleRepository.persist(role);
        return { message: "created user" };
    }

    @Patch("/:id")
    @Authorized(PermissionClaims.readRole)
    @HttpCode(204)
    async update( @Ctx() ctx: any, @Param("id") id: number, @Body() viewModel: RoleViewModel) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const role = await this.roleRepository.findOne({
            where: query,
            join: join
        });
        if (!role) {
            throw new NotFoundError(`role id '${ctx.params.id}' does not exist!`);
        }
        if (role.name === 'admin') {
            throw new ForbiddenError('admin role cannot be updated');
        }
        const claims = viewModel.claims;
        const claimValues = Object.values(PermissionClaims);
        if (claims) {
            role.claims = [];
            for (const claim of claims) {
                if (!claimValues.includes(claim)) {
                    throw new BadRequestError(`claim '${claim}' does not exist`);
                }
                role.claims.push({
                    claimType: ClaimTypes.permission,
                    claimValue: claim
                })
            }
        }
        await this.roleRepository.persist(role);
    }

    @Delete("/:id")
    @Authorized(PermissionClaims.deleteRole)
    @HttpCode(204)
    async delete( @Ctx() ctx: any, @Param("id") id: number) {
        const query = {
            id: id,
            tenantId: ctx.state.user.tenantId
        }
        const role = await this.roleRepository.findOne({
            where: query,
            join: join
        });
        if (!role) {
            throw new NotFoundError(`role id '${ctx.params.id}' does not exist!`);
        }
        if (role.name === 'admin') {
            throw new ForbiddenError('admin role cannot be deleted');
        }
        const users = await role.getUsers();
        if (role.users.length) {
            throw new HttpError(409, "Role is in use. Please delete the user first")
        }
        await this.roleRepository.remove(role);
    }

}