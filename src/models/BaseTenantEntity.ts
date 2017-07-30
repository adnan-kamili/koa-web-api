import { AbstractEntity, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { BaseEntity } from "./BaseEntity";

@AbstractEntity()
export class BaseTenantEntity extends BaseEntity {

    @Exclude()
    @Column()
    tenantId: number;

}
