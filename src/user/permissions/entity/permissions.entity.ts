import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, DeleteDateColumn } from "typeorm";

/**
 * Entity for user
 */
@Entity()
export class Permissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '', nullable: true })
    title: string;

    @Column({  default: '', nullable: true })
    permissions: string;

    @Column({ default: '', nullable: true })
    description: string;

    @Column({ default: false})
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}