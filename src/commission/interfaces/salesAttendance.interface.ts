import { Employee } from 'src/employee/entity/employee.entity';
import { Sales } from 'src/sales/entity/sales.entity';

export interface ISalesAttendance {
  employeeJSON: Employee[];
  saleByEmployeeByCode: {
    [x: string]: Sales;
  };
  stockExecutiveCount: {
    [x: string]: number;
  };
  salesExecutiveCount: {
    [x: string]: number;
  };
  branchesTotal: {
    [x: string]: number;
  };
}
