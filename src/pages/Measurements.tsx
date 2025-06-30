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
  Building
} from 'lucide-react';

const Measurements: React.FC = () => {
  const { uploadedData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!uploadedData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
            <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6">
              Upload an Excel file to view your measurements and analytics data here.
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

  const { summary, table_data } = uploadedData;

  // Filter and sort data
  const filteredData = table_data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  const getColumnIcon = (column: string) => {
    const col = column.toLowerCase();
    if (col.includes('department')) return Building;
    if (col.includes('salary') || col.includes('allowance')) return DollarSign;
    if (col.includes('employee') || col.includes('name')) return Users;
    return BarChart3;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Measurements</h1>
          <p className="text-gray-600 mt-1">
            Uploaded data from {uploadedData.filename} • {summary.total_records} records
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary.total_records.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Columns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {summary.columns.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Quality</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round((1 - Object.values(summary.missing_values).reduce((a, b) => a + b, 0) / (summary.total_records * summary.columns.length)) * 100)}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Missing Values</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Object.values(summary.missing_values).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold">Data Table ({filteredData.length})</h2>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {summary.columns.slice(0, 8).map((column) => {
                  const IconComponent = getColumnIcon(column);
                  return (
                    <th key={column} className="text-left p-4 text-sm font-medium text-gray-600">
                      <button
                        onClick={() => handleSort(column)}
                        className="flex items-center space-x-2 hover:text-gray-900 transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="capitalize">{column.replace(/_/g, ' ')}</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedData.slice(0, 50).map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {summary.columns.slice(0, 8).map((column) => (
                    <td key={column} className="p-4 text-sm text-gray-900">
                      {formatValue(row[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {Math.min(50, sortedData.length)} of {sortedData.length} records
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measurements;