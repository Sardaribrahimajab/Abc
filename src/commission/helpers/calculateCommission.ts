import { Branch } from 'src/branch/entity/branch.entity';
import { ISalesAttendance } from '../interfaces/salesAttendance.interface';
import { Commission } from '../entity/commission.entity';
import { Employee } from 'src/employee/entity/employee.entity';

export const calculateCommission = (
  employee: Employee,
  {
    branchesTotal,
    saleByEmployeeByCode,
    salesExecutiveCount,
    stockExecutiveCount,
  }: ISalesAttendance,
  branches: {
    [x: string]: Branch;
  },
  percentages: Commission[],
  isPromotional: boolean,
): number => {
  const designation = employee.designation;

  if (
    designation === 'National Sales Manager' ||
    designation === 'AM Retail Operations'
  ) {
    let NSMCommission = 0;
    Object.keys(branchesTotal).forEach((key) => {
      if (branches[key].cluster) {
        const percentage =
          percentages.find(
            (info) =>
              info.employeeDesignation === designation &&
              info.isPromotional === isPromotional &&
              info.cluster === branches[key].cluster,
          )?.percentage || 0;
        const netSaleValue = branchesTotal[key] || 0;
        NSMCommission += (Number(percentage) / 100) * netSaleValue;
      }
    });

    return Math.round(NSMCommission);
  } else if (
    designation === 'Area Sales Manager' ||
    designation === 'Assistant Area Sales Manager'
  ) {
    let ASMCommission = 0;
    const assignedBranches = Object.keys(branches).filter(
      (key) => branches[key].areaManager === employee.code,
    );

    Object.keys(branchesTotal).forEach((key) => {
      if (assignedBranches?.includes(key) && branches[key].cluster) {
        const percentage =
          percentages.find(
            (info) =>
              info.employeeDesignation === designation &&
              info.isPromotional === isPromotional &&
              info.cluster === branches[key].cluster,
          )?.percentage || 0;
        const netSaleValue = branchesTotal[key] || 0;
        ASMCommission += (Number(percentage) / 100) * netSaleValue;
      }
    });
    return Math.round(ASMCommission);
  } else {
    const branchCode =
      employee.branch.split(' ').length >= 1
        ? employee.branch.split(' ')[1]
        : '';
    const branch = branches[branchCode];
    if (branch) {
      const percentage =
        percentages.find(
          (info) =>
            info.employeeDesignation === designation &&
            info.isPromotional === isPromotional &&
            info.cluster === branch.cluster,
        )?.percentage || 0;
      const netSaleValue = branchesTotal[branchCode] || 0;
      const days =
        isPromotional || designation === 'Sale Executive'
          ? employee.totalDays - employee.absentDays - employee.leaveAvailed
          : employee.totalDays - employee.absentDays;
      if (
        designation === 'Branch Manager' ||
        designation === 'Assistant Branch Manager'
      ) {
        return days > 0
          ? Math.round(
              (((Number(percentage) / 100) * netSaleValue) /
                employee.totalDays) *
                days,
            )
          : 0;
      } else if (designation === 'Stock Executive') {
        const executiveCount = branch.stockExecutiveCount;
        const currentExecutiveCountKey = Object.keys(stockExecutiveCount).find(
          (key) =>
            key.split(' ').length >= 1
              ? key.split(' ')[1] === branchCode
              : false,
        );

        const perDayCommission =
          ((Number(percentage) / 100) * netSaleValue) /
          (employee.totalDays * executiveCount);
        const commission =
          days > 0
            ? ((perDayCommission * days) /
                stockExecutiveCount[currentExecutiveCountKey] || 1) *
              executiveCount
            : 0;

        return Math.round(commission);
      } else if (designation === 'Sale Executive') {
        if (isPromotional) {
          return days > 0
            ? Math.round(
                (((Number(percentage) / 100) * netSaleValue) /
                  employee.totalDays) *
                  days,
              )
            : 0;
        } else {
          let sale = saleByEmployeeByCode[employee.code]?.salesNetValue;
          if (sale) {
            const negativeSales = Object.values(saleByEmployeeByCode).filter(
              (saleObj) =>
                saleObj.employeeDesignation === 'Sale Executive' &&
                saleObj.salesNetValue < 0,
            );
            const negativeSalesTotal = Math.abs(
              negativeSales.reduce((previous, current) => {
                return previous + current.salesNetValue;
              }, 0),
            );
            const positiveSales = Object.values(saleByEmployeeByCode).filter(
              (saleObj) =>
                saleObj.employeeDesignation !== 'Sale Executive' &&
                saleObj.salesNetValue > 0,
            );
            const positiveSalesTotal = positiveSales.reduce(
              (previous, current) => {
                return previous + current.salesNetValue;
              },
              0,
            );
            const currentExecutiveCountKey = Object.keys(
              salesExecutiveCount,
            ).find((key) =>
              key.split(' ').length >= 1
                ? key.split(' ')[1] === branchCode
                : false,
            );
            sale = sale - negativeSalesTotal + positiveSalesTotal;

            let commission =
              days > 0
                ? (((Number(percentage) / 100) * sale) / employee.totalDays) *
                  days
                : 0;
            commission =
              commission / salesExecutiveCount[currentExecutiveCountKey];
          }
        }
      }
    }
    return 0;
  }
};
