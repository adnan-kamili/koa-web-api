import { Controller, Body, Post, Put, HttpCode, BadRequestError } from "routing-controllers";
import { hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

import { Repository } from "../repository/Repository";
import { Mailer } from "../services/Mailer";
import { AppOptions } from "../options/AppOptions";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { Tenant } from "../models/Tenant";

import { RegisterViewModel } from "../viewModels/RegisterViewModel";
import { EmailViewModel } from "../viewModels/EmailViewModel";
import { PasswordResetViewModel } from "../viewModels/PasswordResetViewModel";

const SALT_ROUNDS = 10;

@Controller("/accounts")
export class AccountsController {

    userRepository: any;

    constructor(private repository: Repository, private mailer: Mailer, private appOptions: AppOptions) {
        this.userRepository = repository.getRepository(User);
    }

    @Post()
    @HttpCode(201)
    async create( @Body() viewModel: RegisterViewModel) {
        return await this.repository.transaction(async (repository) => {

            const userRepository = repository.getRepository(User);
            const roleRepository = repository.getRepository(Role);
            const tenantRepository = repository.getRepository(Tenant);

            const tenant = new Tenant();
            tenant.company = viewModel.company;
            await tenantRepository.save(tenant);
            const role = roleRepository.create({
                name: "admin",
                description: "admin role",
                tenantId: tenant.id,
            });
            await roleRepository.save(role);
            const user = userRepository.create(viewModel);
            if (await userRepository.findOne({ where: { email: user.email } })) {
                throw new BadRequestError(`email already exists!`);
            }
            user.tenantId = tenant.id;
            user.lastLogin = new Date();
            user.password = await hash(viewModel.password, SALT_ROUNDS);
            user.roles = [role];
            await userRepository.save(user);
            return { message: "account created successfully!" };
        });
    }

    @Post("/password-reset-request")
    @HttpCode(202)
    async sendPasswordResetLink( @Body() viewModel: EmailViewModel) {
        const query = { email: viewModel.email };
        const user = await this.userRepository.findOne({ where: query });
        if (user) {
            const payload = {
                email: user.email,
                usage: "password_reset_token"
            };
            const token = sign(payload, user.password, { expiresIn: this.appOptions.jwt.expiry });
            const url = `http://app.example.com/reset-password?token=${token}`;
            const message = `<a href="${url}">Click to reset password!</a>`;
            await this.mailer.sendEmail(user.email, "Password reset request", message);
        }
    }

    @Put("/password-reset")
    @HttpCode(204)
    async resetPassword( @Body() viewModel: PasswordResetViewModel) {
        const query = { email: viewModel.email };
        const user = await this.userRepository.findOne({ where: query });
        if (!user) {
            throw new BadRequestError("email does not exist!");
        }
        try {
            const decoded: any = verify(viewModel.token, user.password);
            if (user.email !== decoded.email) {
                throw new BadRequestError("invalid token!");
            }
        } catch (error) {
            throw new BadRequestError("invalid or expired token!");
        }
        user.password = await hash(viewModel.password, SALT_ROUNDS);
        await this.userRepository.save(user);
    }
}
