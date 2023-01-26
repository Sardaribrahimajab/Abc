import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, DeleteDateColumn } from "typeorm";

/**
 * Entity for user
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: '', nullable: true })
    full_name: string;

    @Column({ default: '', nullable: true })
    first_name: string;

    @Column({ default: '', nullable: true })
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: '', nullable: true })
    username: string;

    @Column()
    password: string;

    @Column()
    user_type: string;

    @Column({ default: false })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

}