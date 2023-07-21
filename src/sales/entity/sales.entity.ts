import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Sales {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'branch_code' })
  branchCode: string;

  @Column({ name: 'branch_name' })
  branchName: string;

  @Column({ name: 'employee_code' })
  employeeCode: string;

  @Column({ name: 'employee_designation' })
  employeeDesignation: string;

  @Column('integer', { name: 'sales_net_value' })
  salesNetValue: number;

  @Column('int', { name: 'branch_total_net_value' })
  branchTotalNetSale: number;

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
