import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'area_manager' })
  areaManager: string;

  @Column()
  region: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  cluster: string;

  @Column({ name: 'stock_executive_count' })
  stockExecutiveCount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
