import { Entity, Column, Index, ManyToMany, OneToMany, JoinTable } from "typeorm";
import { BaseTenantEntity } from "./BaseTenantEntity";
import { User } from "./User";
import { RoleClaim } from "./RoleClaim";

@Entity()
@Index(["name", "tenantId"], { unique: true })
export class Role extends BaseTenantEntity {

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
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
