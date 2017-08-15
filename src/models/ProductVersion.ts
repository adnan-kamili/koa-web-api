import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseTenantEntity } from "./BaseTenantEntity";
import { Product } from "./Product";
import { CustomField } from "./CustomField";

@Entity()
export class ProductVersion extends BaseTenantEntity {

    @Column()
    name: string;

    @Column()
    productId: number;

    @ManyToOne(type => Product, product => product.productVersions, {
        cascadeInsert: true,
        cascadeUpdate: true,
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "productId" })
    product: Product;

    @OneToMany((type) => CustomField, (customField) => customField.productVersion, {
        cascadeInsert: true,
        cascadeUpdate: true
    })
    customFields: CustomField[];
}
