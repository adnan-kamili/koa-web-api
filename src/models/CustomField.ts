import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ProductVersion } from "./ProductVersion";

@Entity()
export class CustomField extends BaseEntity {

    @Column()
    name: string;

    @Column()
    required: boolean;

    @Column()
    accessible: boolean;

    @ManyToOne(type => ProductVersion, productVersion => productVersion.customFields, {
        cascadeInsert: true,
        cascadeUpdate: true,
        nullable: false,
        onDelete: "CASCADE"
    })
    productVersion: ProductVersion;
}
