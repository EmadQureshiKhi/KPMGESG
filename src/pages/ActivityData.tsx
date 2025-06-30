import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronDown, 
  ArrowUpDown,
  Grid3X3,
  BarChart3,
  Download,
  FileSpreadsheet,
  Users,
  TrendingUp,
  DollarSign,
  Building,
  Activity,
  Calendar,
  Target
} from 'lucide-react';

const ActivityData: React.FC = () => {
  const { uploadedData } = useData();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  if (!uploadedData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Activity Data</h2>
            <p className="text-gray-600 mb-6">
              Upload an Excel file to view your activity data and performance metrics here.
            </p>
            <a
              href="/excel-upload"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Upload Excel File</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { summary, table_data, chart_data } = uploadedData;

  // Get unique departments for filter
  const departments = ['all', ...new Set(table_data.map(row => row.department).filter(Boolean))];

  // Filter data by department
  const filteredData = selectedDepartment === 'all' 
    ? table_data 
    : table_data.filter(row => row.department === selectedDepartment);

  // Calculate activity metrics
  const activityMetrics = {
    totalEmployees: filteredData.length,
    avgSalary: filteredData.reduce((sum, row) => sum + (row.salary || 0), 0) / filteredData.length,
    totalFuelAllowance: filteredData.reduce((sum, row) => sum + (row.fuel_allowance || 0), 0),
    avgAge: filteredData.reduce((sum, row) => sum + (row.age || 0), 0) / filteredData.length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Data</h1>
          <p className="text-gray-600 mt-1">
            Employee activity and performance metrics • {filteredData.length} records
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-sm ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Cards
            </button>
          </div>
          
          <button className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {activityMetrics.totalEmployees.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {selectedDepartment === 'all' ? 'All departments' : selectedDepartment}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Salary</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${Math.round(activityMetrics.avgSalary).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-1">Per employee</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fuel Allowance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${Math.round(activityMetrics.totalFuelAllowance).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-1">Monthly total</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Age</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(activityMetrics.avgAge)} years
              </p>
              <p className="text-sm text-orange-600 mt-1">Workforce average</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Display */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Employee Activity Data</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Department</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Grade</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Salary</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Fuel Allowance</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Age</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.slice(0, 20).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {row.employee_name || row.name || `Employee ${row.employee_code || index + 1}`}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{row.department || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">{row.grade || '-'}</td>
                    <td className="p-4 text-sm text-gray-900">
                      {row.salary ? `$${row.salary.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {row.fuel_allowance ? `$${row.fuel_allowance.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{row.age || '-'}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {row.experience ? `${row.experience} years` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.slice(0, 12).map((row, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {(row.employee_name || row.name || 'E').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {row.employee_name || row.name || `Employee ${row.employee_code || index + 1}`}
                    </h3>
                    <p className="text-sm text-gray-600">{row.department || 'Unknown Dept'}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {row.grade || 'N/A'}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Salary</span>
                  <span className="font-medium text-gray-900">
                    {row.salary ? `$${row.salary.toLocaleString()}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fuel Allowance</span>
                  <span className="font-medium text-gray-900">
                    {row.fuel_allowance ? `$${row.fuel_allowance.toLocaleString()}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Age</span>
                  <span className="font-medium text-gray-900">{row.age || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">
                    {row.experience ? `${row.experience} years` : '-'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityData;