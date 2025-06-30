import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { CustomTooltip } from '../../../utils/chartUtils';

interface FuelAllowanceBarChartProps {
  data: Array<{ department: string; total_fuel_allowance: number }>;
}

const FuelAllowanceBarChart: React.FC<FuelAllowanceBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Fuel Allowance by Department</h3>
          <p className="text-sm text-gray-600 mt-1">Monthly fuel allowance distribution</p>
        </div>
        <BarChart3 className="w-6 h-6 text-gray-400" />
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="department" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={11}
              fontWeight={500}
              stroke="#64748b"
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              fontSize={12}
              fontWeight={500}
              stroke="#64748b"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Fuel Allowance']} 
            />
            <Bar 
              dataKey="total_fuel_allowance" 
              fill="url(#blueGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuelAllowanceBarChart;