import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn , OneToMany, ManyToOne, OneToOne, DeleteDateColumn } from "typeorm";

/**
 * Entity for user
 */
@Entity()
export class roles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '', nullable: true })
    title: string;

    @Column({  default: '', nullable: true })
    permissions: string;

    @Column({ default: '', nullable: true })
    sulg: string;

    @Column({ default: false})
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}