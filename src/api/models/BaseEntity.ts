import {AbstractEntity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn} from "typeorm";

@AbstractEntity()
export class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}