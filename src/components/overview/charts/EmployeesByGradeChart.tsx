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
import { Users } from 'lucide-react';
import { CustomTooltip } from '../../../utils/chartUtils';

interface EmployeesByGradeChartProps {
  data: Array<{ grade: string; count: number }>;
}

const EmployeesByGradeChart: React.FC<EmployeesByGradeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Employees by Grade</h3>
          <p className="text-sm text-gray-600 mt-1">Workforce distribution by grade level</p>
        </div>
        <Users className="w-6 h-6 text-gray-400" />
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="grade" 
              fontSize={12}
              fontWeight={500}
              stroke="#64748b"
            />
            <YAxis 
              fontSize={12}
              fontWeight={500}
              stroke="#64748b"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="url(#greenGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeesByGradeChart;