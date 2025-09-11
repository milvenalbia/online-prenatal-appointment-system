import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { Download, FileSpreadsheet, BarChart3 } from 'lucide-react';

const OutPatientReports = () => {
  // Sample data - replace with your actual data
  const [data] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      department: 'Engineering',
      salary: 85000,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      department: 'Marketing',
      salary: 65000,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      age: 35,
      department: 'Sales',
      salary: 75000,
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      age: 28,
      department: 'HR',
      salary: 60000,
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      age: 32,
      department: 'Finance',
      salary: 90000,
    },
  ]);

  // Utility function to save the workbook
  const saveWorkbook = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Basic download function
  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Salary', key: 'salary', width: 15 },
    ];

    // Add data
    worksheet.addRows(data);

    await saveWorkbook(workbook, 'data.xlsx');
  };

  // Advanced download with styling
  const downloadExcelAdvanced = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Data');

    // Define columns with styling
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Full Name', key: 'name', width: 20 },
      { header: 'Email Address', key: 'email', width: 25 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Salary', key: 'salary', width: 15 },
    ];

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '366092' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    // Add data
    data.forEach((item, index) => {
      const row = worksheet.addRow(item);

      // Alternate row colors
      if (index % 2 === 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F8F9FA' },
        };
      }

      // Format salary as currency
      const salaryCell = row.getCell('salary');
      salaryCell.numFmt = '$#,##0.00';
    });

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    await saveWorkbook(workbook, 'employee_data_styled.xlsx');
  };

  // Download multiple sheets with advanced features
  const downloadMultipleSheets = async () => {
    const workbook = new ExcelJS.Workbook();

    // Sheet 1: All employees
    const allSheet = workbook.addWorksheet('All Employees');
    allSheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Salary', key: 'salary', width: 15 },
    ];

    // Style header
    const allHeaderRow = allSheet.getRow(1);
    allHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    allHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' },
    };

    // Add data with conditional formatting
    data.forEach((item) => {
      const row = allSheet.addRow(item);
      const salaryCell = row.getCell('salary');
      salaryCell.numFmt = '$#,##0.00';

      // Highlight high salaries
      if (item.salary > 80000) {
        salaryCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'C6EFCE' },
        };
        salaryCell.font = { bold: true };
      }
    });

    // Sheet 2: Department Summary
    const summarySheet = workbook.addWorksheet('Department Summary', {
      tabColor: { argb: '70AD47' },
    });

    const departments = [...new Set(data.map((emp) => emp.department))];
    const summary = departments.map((dept) => {
      const deptEmployees = data.filter((emp) => emp.department === dept);
      return {
        department: dept,
        count: deptEmployees.length,
        avgAge: Math.round(
          deptEmployees.reduce((sum, emp) => sum + emp.age, 0) /
            deptEmployees.length
        ),
        totalSalary: deptEmployees.reduce((sum, emp) => sum + emp.salary, 0),
        avgSalary: Math.round(
          deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) /
            deptEmployees.length
        ),
      };
    });

    summarySheet.columns = [
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Employee Count', key: 'count', width: 15 },
      { header: 'Average Age', key: 'avgAge', width: 12 },
      { header: 'Total Salary', key: 'totalSalary', width: 15 },
      { header: 'Average Salary', key: 'avgSalary', width: 15 },
    ];

    // Style summary header
    const summaryHeaderRow = summarySheet.getRow(1);
    summaryHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    summaryHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '70AD47' },
    };

    // Add summary data
    summary.forEach((item) => {
      const row = summarySheet.addRow(item);
      row.getCell('totalSalary').numFmt = '$#,##0.00';
      row.getCell('avgSalary').numFmt = '$#,##0.00';
    });

    // Sheet 3: Charts Data (formatted for easy chart creation)
    const chartSheet = workbook.addWorksheet('Charts Data', {
      tabColor: { argb: 'E7E6E6' },
    });

    // Age distribution data
    chartSheet.addRow(['Age Distribution']);
    chartSheet.addRow(['Age Range', 'Count']);

    const ageRanges = [
      {
        range: '20-25',
        count: data.filter((emp) => emp.age >= 20 && emp.age <= 25).length,
      },
      {
        range: '26-30',
        count: data.filter((emp) => emp.age >= 26 && emp.age <= 30).length,
      },
      {
        range: '31-35',
        count: data.filter((emp) => emp.age >= 31 && emp.age <= 35).length,
      },
      {
        range: '36-40',
        count: data.filter((emp) => emp.age >= 36 && emp.age <= 40).length,
      },
    ];

    ageRanges.forEach((item) => {
      chartSheet.addRow([item.range, item.count]);
    });

    // Style chart data
    chartSheet.getCell('A1').font = { bold: true, size: 14 };
    chartSheet.getRow(2).font = { bold: true };

    await saveWorkbook(workbook, 'employee_report_multi.xlsx');
  };

  // Download with rich formatting and data validation
  const downloadRichFormatting = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rich Format');

    // Set up columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Salary', key: 'salary', width: 15 },
      { header: 'Performance', key: 'performance', width: 12 },
    ];

    // Create a beautiful header
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.font = {
      bold: true,
      color: { argb: 'FFFFFF' },
      size: 12,
      name: 'Calibri',
    };
    headerRow.fill = {
      type: 'gradient',
      gradient: 'angle',
      degree: 0,
      stops: [
        { position: 0, color: { argb: '4472C4' } },
        { position: 1, color: { argb: '70AD47' } },
      ],
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add data with performance ratings
    data.forEach((item, index) => {
      const performanceRating = [
        'Excellent',
        'Good',
        'Average',
        'Needs Improvement',
      ][Math.floor(Math.random() * 4)];
      const row = worksheet.addRow({
        ...item,
        performance: performanceRating,
      });

      // Format salary
      row.getCell('salary').numFmt = '$#,##0.00';

      // Color code performance
      const perfCell = row.getCell('performance');
      switch (performanceRating) {
        case 'Excellent':
          perfCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          };
          perfCell.font = { color: { argb: '006100' }, bold: true };
          break;
        case 'Good':
          perfCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEB9C' },
          };
          perfCell.font = { color: { argb: '9C6500' } };
          break;
        case 'Average':
          perfCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEB9C' },
          };
          break;
        case 'Needs Improvement':
          perfCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC7CE' },
          };
          perfCell.font = { color: { argb: '9C0006' } };
          break;
      }

      // Add data bars for salary visualization
      const salaryCell = row.getCell('salary');
      const maxSalary = Math.max(...data.map((d) => d.salary));
      const percentage = (item.salary / maxSalary) * 100;

      if (percentage > 80) {
        salaryCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'C6EFCE' },
        };
      } else if (percentage > 60) {
        salaryCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEB9C' },
        };
      }
    });

    // Add a summary section
    const summaryStartRow = data.length + 3;
    worksheet.mergeCells(`A${summaryStartRow}:G${summaryStartRow}`);
    const summaryTitleCell = worksheet.getCell(`A${summaryStartRow}`);
    summaryTitleCell.value = 'SUMMARY STATISTICS';
    summaryTitleCell.font = { bold: true, size: 14, color: { argb: '366092' } };
    summaryTitleCell.alignment = { horizontal: 'center' };

    // Add statistics
    const stats = [
      ['Total Employees:', data.length],
      [
        'Average Age:',
        Math.round(data.reduce((sum, emp) => sum + emp.age, 0) / data.length),
      ],
      [
        'Total Payroll:',
        `$${data.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}`,
      ],
      [
        'Average Salary:',
        `$${Math.round(
          data.reduce((sum, emp) => sum + emp.salary, 0) / data.length
        ).toLocaleString()}`,
      ],
    ];

    stats.forEach((stat, index) => {
      const row = summaryStartRow + 2 + index;
      worksheet.getCell(`A${row}`).value = stat[0];
      worksheet.getCell(`B${row}`).value = stat[1];
      worksheet.getCell(`A${row}`).font = { bold: true };
    });

    await saveWorkbook(workbook, 'employee_rich_format.xlsx');
  };

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>
        ExcelJS Download Examples
      </h1>

      {/* Data Preview */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>
          Sample Data
        </h2>
        <div className='overflow-x-auto bg-white rounded-lg shadow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Age
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Salary
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {data.map((row) => (
                <tr key={row.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {row.id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {row.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {row.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {row.age}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {row.department}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    ${row.salary.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Buttons */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        <button
          onClick={downloadExcel}
          className='flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          <Download className='w-4 h-4 mr-2' />
          Basic Download
        </button>

        <button
          onClick={downloadExcelAdvanced}
          className='flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
        >
          <FileSpreadsheet className='w-4 h-4 mr-2' />
          Advanced Styling
        </button>

        <button
          onClick={downloadMultipleSheets}
          className='flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
        >
          <FileSpreadsheet className='w-4 h-4 mr-2' />
          Multiple Sheets
        </button>

        <button
          onClick={downloadRichFormatting}
          className='flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'
        >
          <BarChart3 className='w-4 h-4 mr-2' />
          Rich Formatting
        </button>
      </div>

      {/* Implementation Notes */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4 text-gray-700'>
          ExcelJS Implementation Features
        </h2>
        <div className='bg-gray-100 p-4 rounded-lg text-sm space-y-2'>
          <p>
            <strong>Basic Usage:</strong> Simple data export with column
            definitions
          </p>
          <p>
            <strong>Advanced Styling:</strong> Custom fonts, colors, borders,
            and cell formatting
          </p>
          <p>
            <strong>Multiple Sheets:</strong> Color-coded sheets with
            conditional formatting
          </p>
          <p>
            <strong>Rich Formatting:</strong> Gradients, data bars, performance
            indicators, and summary statistics
          </p>
        </div>

        <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <h3 className='font-semibold text-blue-800 mb-2'>
            ExcelJS Advanced Features Demonstrated:
          </h3>
          <ul className='text-blue-700 text-sm space-y-1'>
            <li>
              • <strong>Cell Styling:</strong> Custom fonts, colors, borders,
              and alignment
            </li>
            <li>
              • <strong>Conditional Formatting:</strong> Color-coded cells based
              on values
            </li>
            <li>
              • <strong>Number Formats:</strong> Currency formatting for salary
              columns
            </li>
            <li>
              • <strong>Gradient Fills:</strong> Beautiful header backgrounds
            </li>
            <li>
              • <strong>Row Heights:</strong> Customizable row dimensions
            </li>
            <li>
              • <strong>Tab Colors:</strong> Color-coded worksheet tabs
            </li>
            <li>
              • <strong>Merged Cells:</strong> Professional summary sections
            </li>
            <li>
              • <strong>Data Visualization:</strong> Color-coded performance
              indicators
            </li>
          </ul>
        </div>

        <div className='mt-4 bg-green-50 border border-green-200 rounded-lg p-4'>
          <h3 className='font-semibold text-green-800 mb-2'>Installation:</h3>
          <code className='text-green-700 bg-green-100 px-2 py-1 rounded text-sm'>
            npm install exceljs
          </code>
          <p className='text-green-700 text-sm mt-2'>
            ExcelJS provides much more advanced styling capabilities compared to
            SheetJS/XLSX, including gradients, conditional formatting, data
            validation, and professional chart-ready data formatting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OutPatientReports;
