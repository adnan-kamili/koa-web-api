import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
