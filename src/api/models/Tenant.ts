import { Entity, Column } from "typeorm";
import { BaseEntity } from './BaseEntity';

@Entity()
export class Tenant extends BaseEntity{

    @Column({ nullable: false })
    company: string;
}