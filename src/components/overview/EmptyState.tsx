import React from 'react';
import { BarChart3, FileSpreadsheet } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data to Visualize</h2>
          <p className="text-gray-600 mb-6">
            Upload an Excel file to see beautiful charts and analytics of your data.
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
};

export default EmptyState;