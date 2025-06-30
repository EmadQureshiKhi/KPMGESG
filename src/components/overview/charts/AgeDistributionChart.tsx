import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Activity } from 'lucide-react';
import { CustomTooltip } from '../../../utils/chartUtils';

interface AgeDistributionChartProps {
  data: Array<{ age_range: string; count: number }>;
}

const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Age Distribution</h3>
          <p className="text-sm text-gray-600 mt-1">Workforce age demographics analysis</p>
        </div>
        <Activity className="w-6 h-6 text-gray-400" />
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="age_range" 
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
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8b5cf6" 
              strokeWidth={4}
              dot={{ fill: '#8b5cf6', strokeWidth: 3, r: 8 }}
              activeDot={{ r: 10, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgeDistributionChart;