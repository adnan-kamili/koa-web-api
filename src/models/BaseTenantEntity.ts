import { Index, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { BaseEntity } from "./BaseEntity";

@Index(["id", "tenantId"], { unique: true })
export class BaseTenantEntity extends BaseEntity {

    @Exclude()
    @Column()
    tenantId: number;
}
