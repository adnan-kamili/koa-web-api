import { AbstractEntity, Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@AbstractEntity()
export class BaseTenantEntity extends BaseEntity {

    @Column("int")
    tenantId: number;

}
