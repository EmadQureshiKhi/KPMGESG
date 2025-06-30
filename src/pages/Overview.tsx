import React from 'react';
import { useData } from '../contexts/DataContext';
import EmptyState from '../components/overview/EmptyState';
import MetricsCards from '../components/overview/MetricsCards';
import DepartmentPieChart from '../components/overview/charts/DepartmentPieChart';
import FuelAllowanceBarChart from '../components/overview/charts/FuelAllowanceBarChart';
import EmployeesByGradeChart from '../components/overview/charts/EmployeesByGradeChart';
import SalaryAreaChart from '../components/overview/charts/SalaryAreaChart';
import AgeDistributionChart from '../components/overview/charts/AgeDistributionChart';
import DataQualitySummary from '../components/overview/DataQualitySummary';

const Overview: React.FC = () => {
  const { uploadedData } = useData();

  if (!uploadedData) {
    return <EmptyState />;
  }

  const { summary, chart_data, table_data } = uploadedData;

  // Calculate additional metrics
  const totalSalary = table_data.reduce((sum, row) => sum + (row.salary || 0), 0);
  const totalFuelAllowance = table_data.reduce((sum, row) => sum + (row.fuel_allowance || 0), 0);
  const avgAge = table_data.reduce((sum, row) => sum + (row.age || 0), 0) / table_data.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <MetricsCards
        summary={summary}
        totalSalary={totalSalary}
        totalFuelAllowance={totalFuelAllowance}
        avgAge={avgAge}
        filename={uploadedData.filename}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Department Distribution */}
        {chart_data.department_distribution && (
          <DepartmentPieChart data={chart_data.department_distribution} />
        )}

        {/* Fuel Allowance by Department */}
        {chart_data.fuel_allowance_by_department && (
          <FuelAllowanceBarChart data={chart_data.fuel_allowance_by_department} />
        )}

        {/* Employees by Grade */}
        {chart_data.employees_by_grade && (
          <EmployeesByGradeChart data={chart_data.employees_by_grade} />
        )}

        {/* Average Salary by Department */}
        {chart_data.average_salary_by_department && (
          <SalaryAreaChart data={chart_data.average_salary_by_department} />
        )}
      </div>

      {/* Age Distribution - Full Width */}
      {chart_data.age_distribution && (
        <AgeDistributionChart data={chart_data.age_distribution} />
      )}

      {/* Data Quality Summary */}
      <DataQualitySummary summary={summary} />
    </div>
  );
};

export default Overview;