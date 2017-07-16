import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Exclude } from "class-transformer";

import { BaseTenantEntity } from "./BaseTenantEntity";
import { Role } from "./Role";

@Entity()
export class User extends BaseTenantEntity {

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    lastLogin: Date;

    @ManyToMany(type => Role, role => role.users, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    @JoinTable()
    roles: Role[];
}
