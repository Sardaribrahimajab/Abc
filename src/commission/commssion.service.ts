import { Injectable, UploadedFiles } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { extractJSON } from './helpers/extractJSON.helper';
import { Commission } from './entity/commission.entity';
import { EmployeeService } from 'src/employee/employee.service';
import { BranchService } from 'src/branch/branch.service';
import { SalesService } from 'src/sales/sales.service';
import { calculateCommission } from './helpers/calculateCommission';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
    private readonly branchService: BranchService,
    private readonly employeeService: EmployeeService,
    private readonly salesService: SalesService,
  ) {}

  async calculateCommission(
    @UploadedFiles() files: Array<Express.Multer.File>,
    isPromotional: boolean,
  ) {
    try {
      let {
        employeeJSON,
        saleByEmployeeByCode,
        stockExecutiveCount,
        salesExecutiveCount,
        branchesTotal,
      } = extractJSON(files, isPromotional);

      const percentages = await this.getAllCommissions();

      const branches = await this.branchService.getBranchesObject();
      let employeeCommissionData = employeeJSON.map((employee) => {
        const commission =
          calculateCommission(
            employee,
            {
              employeeJSON,
              saleByEmployeeByCode,
              stockExecutiveCount,
              salesExecutiveCount,
              branchesTotal,
            },
            branches,
            percentages,
            isPromotional,
          ) || 0;

        employee.commission = commission || 0;
        return employee;
      });

      this.employeeService.bulkInsert(employeeCommissionData),
        this.salesService.bulkInsert(Object.values(saleByEmployeeByCode));

      return employeeCommissionData;
    } catch (error) {
      throw error;
    }
  }

  async bulkInsert(commissions: Commission[]): Promise<Commission[]> {
    return this.commissionRepository.save(commissions);
  }

  async getAllCommissions(): Promise<Commission[]> {
    return this.commissionRepository.find();
  }
}
