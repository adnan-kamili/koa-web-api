import { Entity, Column, OneToMany } from "typeorm";
import { BaseTenantEntity } from "./BaseTenantEntity";
import { ProductVersion } from "./ProductVersion";

@Entity()
export class Product extends BaseTenantEntity {

    @Column()
    name: string;

    @OneToMany((type) => ProductVersion, (productVersion) => productVersion.product, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    productVersions: ProductVersion[];
}
