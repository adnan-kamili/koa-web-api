import { Controller, Param, Body, Get, Post, Patch, Delete, ForbiddenError, HttpError } from "routing-controllers";
import { HttpCode, Authorized, Ctx, QueryParam, UseAfter, BadRequestError, NotFoundError } from "routing-controllers";
import { RoleViewModel } from "../viewModels/RoleViewModel";
import { PermissionClaims } from "../policies/PermissionClaims";
import { ClaimTypes } from "../policies/ClaimTypes";
import { PaginationHeader } from "../middlewares/PaginationHeader";
import { Repository } from "../repository/Repository";
import { Role } from "../models/Role";

const join = { alias: "role", leftJoinAndSelect: { claims: "role.claims" } };
const updateBodyOptions = { validate: { skipMissingProperties: true } };

@Controller("/roles")
export class RolesController {
    roleRepository: any;

    constructor(private repository: Repository) {
        this.roleRepository = this.repository.getRepository(Role);
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
            where: { tenantId: ctx.state.user.tenantId }, join, limit, offset
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
            id,
            tenantId: ctx.state.user.tenantId
        };
        const role = await this.roleRepository.findOne({ where: query, join });
        if (!role) {
            throw new NotFoundError(`role id '${ctx.params.id}' does not exist!`);
        }
        role.claims = role.claims.map((claim: any) => claim.claimValue);
        return role;
    }

    @Post()
    @Authorized(PermissionClaims.createRole)
    @HttpCode(201)
    async create( @Ctx() ctx: any, @Body() viewModel: RoleViewModel) {
        const role = this.roleRepository.create(viewModel);
        role.name = role.name.toLowerCase();
        role.tenantId = ctx.state.user.tenantId;
        const query = {
            name: role.name,
            tenantId: ctx.state.user.tenantId
        };
        if (await this.roleRepository.findOne({ where: query })) {
            throw new BadRequestError(`role '${role.name}' already exists!`);
        }
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
            });
        }
        await this.roleRepository.save(role);
        ctx.set("Location", `/v1/roles/${role.id}`);
        return { message: "role created successfully!" };
    }

    @Patch("/:id")
    @Authorized(PermissionClaims.updateRole)
    @HttpCode(204)
    async update( @Ctx() ctx: any, @Param("id") id: number, @Body(updateBodyOptions) viewModel: RoleViewModel) {
        const query = { id, tenantId: ctx.state.user.tenantId };
        const role = await this.roleRepository.findOne({ where: query, join });
        if (!role) {
            throw new NotFoundError(`role id '${ctx.params.id}' does not exist!`);
        }
        if (role.name === "admin") {
            throw new ForbiddenError("admin role cannot be updated");
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
                });
            }
        }
        if (viewModel.name && viewModel.name.toLowerCase() !== role.name) {
            const roleQuery = { name: viewModel.name.toLowerCase(), tenantId: ctx.state.user.tenantId };
            if (await this.roleRepository.findOne({ where: roleQuery })) {
                throw new BadRequestError(`role '${role.name}' already exists!`);
            }
            role.name = viewModel.name;
        }
        if (viewModel.description) {
            role.description = viewModel.description;
        }
        await this.roleRepository.save(role);
    }

    @Delete("/:id")
    @Authorized(PermissionClaims.deleteRole)
    @HttpCode(204)
    async delete( @Ctx() ctx: any, @Param("id") id: number) {
        const query = { id, tenantId: ctx.state.user.tenantId };
        const role = await this.roleRepository.findOne({
            where: query,
            join: {
                alias: "role",
                leftJoinAndSelect: {
                    claims: "role.claims",
                    users: "role.users"
                }
            }
        });
        if (!role) {
            throw new NotFoundError(`role id '${ctx.params.id}' does not exist!`);
        }
        if (role.name === "admin") {
            throw new ForbiddenError("admin role cannot be deleted");
        }
        if (role.users.length) {
            throw new HttpError(409, "role is in use");
        }
        await this.roleRepository.remove(role);
    }
}
