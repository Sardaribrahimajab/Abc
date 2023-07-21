import * as xlsx from 'xlsx';
import * as fs from 'fs';
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
              branchesTotal,
            },
            branches,
            percentages,
            isPromotional,
          ) || 0;

        employee.commission = commission || 0;
        return employee;
      });

      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(employeeCommissionData);
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelFile = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'buffer',
      });
      fs.writeFileSync('output.xlsx', excelFile);

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
