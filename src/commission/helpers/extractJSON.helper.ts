import * as xlsx from 'xlsx';
import { ISalesAttendance } from '../interfaces/salesAttendance.interface';

export const extractJSON = (
  files: Array<Express.Multer.File>,
  isPromotional: boolean,
): ISalesAttendance => {
  let salesFile, employeeFile;
  files.forEach((file) => {
    if (file.fieldname.includes('employee')) employeeFile = file;
    else if (file.fieldname.includes('sales')) salesFile = file;
  });
  const employeeFileWorkbook = xlsx.read(employeeFile.buffer, {
    type: 'buffer',
  });
  const employeeFileSheetName = employeeFileWorkbook.SheetNames[0];
  const employeeFileWorksheet =
    employeeFileWorkbook.Sheets[employeeFileSheetName];

  const cellReference = xlsx.utils.encode_cell({ r: 2, c: 2 });
  const cellData = employeeFileWorksheet[cellReference];
  const dateString = cellData?.v?.split('-');
  let startDate;
  let endDate;

  if (dateString?.length) {
    startDate = new Date(dateString[0].split('/').join('-'));
    endDate = new Date(dateString[1].split('/').join('-'));
  }

  let employeeJSON = xlsx.utils.sheet_to_json(employeeFileWorksheet, {
    range: 4,
    skipHidden: true,
  });
  let filteredEmployeeJSON = [];
  let stockExecutiveCount = {};

  employeeJSON.forEach((data) => {
    if (data['Code']) {
      filteredEmployeeJSON.push({
        code: data['Code'].toString(),
        name: data['EmployeeName'],
        branch: data['Station'],
        designation: data['Designation'],
        presentDays: data['TotalPresent'],
        absentDays: data['TotalAbsent'],
        leaveAvailed: data['TotalLeaveAvail'],
        totalDays: data['Total Days'],
        isPromotional,
        startDate,
        endDate,
      });

      if (data['Designation'] === 'Stock Executive') {
        stockExecutiveCount[data['Station']] =
          (stockExecutiveCount[data['Station']] || 0) + 1;
      }
    }
  });

  const salesFileWorkbook = xlsx.read(salesFile.buffer, {
    type: 'buffer',
  });
  const salesFileSheetName = salesFileWorkbook.SheetNames[0];
  const salesFileWorksheet = salesFileWorkbook.Sheets[salesFileSheetName];

  let salesJSON = xlsx.utils.sheet_to_json(salesFileWorksheet, {
    range: 'A4:J1000',
    skipHidden: true,
  });

  const branchesTotal = {};
  salesJSON.forEach((data) => {
    if (
      data['Branch'] === 'Totals' &&
      !data['Sales Assistant'].includes('Grand')
    ) {
      branchesTotal[data['Sales Assistant'].split(' ')[1]] =
        data['Nett\n Value'];
    }
  });

  let employeesSaleObject = {};
  salesJSON.forEach((data) => {
    if (Number(data['Branch'])) {
      employeesSaleObject[Number(data['Employee\nCode'])] = {
        branchCode: data['Branch'],
        branchName: data['Name'],
        employeeCode: data['Employee\nCode'],
        employeeDesignation: data['Designation'],
        salesNetValue: data['Nett\n Value'],
        branchTotalNetSale: branchesTotal[String(data['Branch'])],
        startDate,
        endDate,
      };
    }
  });

  return {
    employeeJSON: filteredEmployeeJSON,
    saleByEmployeeByCode: employeesSaleObject,
    stockExecutiveCount,
    branchesTotal,
  };
};
