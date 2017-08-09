import { Entity, Column, ManyToMany, OneToMany } from "typeorm";
import { BaseTenantEntity } from "./BaseTenantEntity";
import { User } from "./User";
import { RoleClaim } from "./RoleClaim";

@Entity()
export class Role extends BaseTenantEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany((type) => User, (user) => user.roles, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    users: User[];
    @OneToMany((type) => RoleClaim, (roleClaim) => roleClaim.role, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    claims: RoleClaim[];
}
