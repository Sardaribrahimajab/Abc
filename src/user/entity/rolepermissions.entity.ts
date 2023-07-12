import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany, OneToOne, ManyToOne, DeleteDateColumn } from "typeorm";
import { roles } from "../roles/entity/role.entity";
import  { Permissions } from "../permissions/entity/permissions.entity"

/**
 * Entity for user
 */
@Entity()
export class rolepermissions {
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(() => roles)
    @JoinColumn()
    role: number;

    @OneToOne(() => Permissions)
    @JoinColumn()
    permission: number;
}