import React from 'react';
import { 
  FileSpreadsheet,
  DollarSign,
  Target,
  Users
} from 'lucide-react';

interface MetricsCardsProps {
  summary: {
    total_records: number;
  };
  totalSalary: number;
  totalFuelAllowance: number;
  avgAge: number;
  filename: string;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  summary,
  totalSalary,
  totalFuelAllowance,
  avgAge,
  filename
}) => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Overview</h1>
        <p className="text-gray-600">
          Visual analytics and insights from {filename} • {summary.total_records} records
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary.total_records.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-1">Data points</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${Math.round(totalSalary).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">Monthly</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fuel Allowances</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${Math.round(totalFuelAllowance).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-1">Total monthly</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Employee Age</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(avgAge)} years
              </p>
              <p className="text-sm text-orange-600 mt-1">Workforce</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MetricsCards;