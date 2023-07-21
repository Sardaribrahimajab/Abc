import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  branch: string;

  @Column()
  designation: string;

  @Column('int', { name: 'present_days' })
  presentDays: number;

  @Column('int', { name: 'absent_days' })
  absentDays: number;

  @Column('int', { name: 'leave_availed' })
  leaveAvailed: number;

  @Column('int', { name: 'total_days' })
  totalDays: number;

  @Column('int')
  commission: number;

  @Column({ name: 'is_promotional', default: false, nullable: true })
  isPromotional: boolean;

  @Column({ name: 'start_date', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
