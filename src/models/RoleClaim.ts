import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Role } from "./Role";

@Entity()
export class RoleClaim extends BaseEntity {

    @Column()
    claimType: string;

    @Column()
    claimValue: string;

    @ManyToOne(type => Role, role => role.claims, {
        cascadeInsert: true,
        cascadeUpdate: true,
        onDelete: "CASCADE"
    })
    role: Role;
}
