import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { COLORS } from '../../../utils/chartColors';

interface DepartmentPieChartProps {
  data: Array<{ name: string; value: number }>;
}

const DepartmentPieChart: React.FC<DepartmentPieChartProps> = ({ data }) => {
  // Enhanced pie chart tooltip
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Count: {data.value}
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Enhanced legend component with better wrapping
  const EnhancedLegend = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className="mt-6 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-32 overflow-y-auto">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 min-w-0">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-700 font-medium truncate" title={entry.value}>
                {entry.value.length > 20 ? `${entry.value.substring(0, 20)}...` : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Process pie chart data to add totals for percentage calculation
  const processPieData = (data: any[]) => {
    if (!data || data.length === 0) return [];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map(item => ({
      ...item,
      total: total
    }));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Department Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Employee allocation across departments</p>
        </div>
        <PieChartIcon className="w-6 h-6 text-gray-400" />
      </div>
      
      {/* Responsive container with proper aspect ratio */}
      <div className="w-full" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={processPieData(data)}
              cx="50%"
              cy="45%"
              labelLine={false}
              outerRadius="65%"
              innerRadius="35%"
              fill="#8884d8"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend 
              content={<EnhancedLegend />}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentPieChart;