import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from './BaseEntity';
import { Role } from './Role';


@Entity()
export class RoleClaim extends BaseEntity {

    @Column({ nullable: false })
    claimType: string;

    @Column({ nullable: false })
    claimValue: string;

    @ManyToOne(type => Role, role => role.claims, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    role: Role;
}