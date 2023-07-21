import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_designation' })
  employeeDesignation: string;

  @Column({ name: 'is_promotional', default: false, nullable: true })
  isPromotional: boolean;

  @Column()
  cluster: string;

  @Column()
  percentage: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
