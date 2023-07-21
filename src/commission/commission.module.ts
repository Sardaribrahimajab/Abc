import { Module } from '@nestjs/common';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commssion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './entity/commission.entity';
import { BranchModule } from 'src/branch/branch.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Commission]),
    BranchModule,
    EmployeeModule,
    SalesModule,
  ],
  controllers: [CommissionController],
  providers: [CommissionService],
})
export class CommissionModule {}
