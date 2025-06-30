import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DollarSign } from 'lucide-react';
import { CustomTooltip } from '../../../utils/chartUtils';

interface SalaryAreaChartProps {
  data: Array<{ department: string; average_salary: number }>;
}

const SalaryAreaChart: React.FC<SalaryAreaChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Average Salary by Department</h3>
          <p className="text-sm text-gray-600 mt-1">Compensation analysis across departments</p>
        </div>
        <DollarSign className="w-6 h-6 text-gray-400" />
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
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
              formatter={(value: any) => [`$${value.toLocaleString()}`, 'Average Salary']} 
            />
            <Area 
              type="monotone" 
              dataKey="average_salary" 
              stroke="#f59e0b" 
              strokeWidth={3}
              fill="url(#amberGradient)"
            />
            <defs>
              <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalaryAreaChart;