import React from 'react';
import { 
  TrendingUp, 
  Building, 
  FileSpreadsheet 
} from 'lucide-react';

interface DataQualitySummaryProps {
  summary: {
    total_records: number;
    columns: string[];
    missing_values: Record<string, number>;
  };
}

const DataQualitySummary: React.FC<DataQualitySummaryProps> = ({ summary }) => {
  const dataCompleteness = Math.round(
    (1 - Object.values(summary.missing_values).reduce((a, b) => a + b, 0) / 
    (summary.total_records * summary.columns.length)) * 100
  );

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Data Quality Summary</h3>
      <p className="text-sm text-gray-600 mb-8">Comprehensive analysis of data completeness and integrity</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Data Completeness</h4>
          <p className="text-3xl font-bold text-green-600 mb-2">
            {dataCompleteness}%
          </p>
          <p className="text-sm text-gray-600">Complete data points</p>
        </div>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Building className="w-10 h-10 text-blue-600" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Data Columns</h4>
          <p className="text-3xl font-bold text-blue-600 mb-2">{summary.columns.length}</p>
          <p className="text-sm text-gray-600">Available attributes</p>
        </div>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FileSpreadsheet className="w-10 h-10 text-purple-600" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-lg">Data Volume</h4>
          <p className="text-3xl font-bold text-purple-600 mb-2">{summary.total_records.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Total records</p>
        </div>
      </div>
    </div>
  );
};

export default DataQualitySummary;