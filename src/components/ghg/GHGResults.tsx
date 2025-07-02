import React, { useState } from 'react';
import { ArrowLeft, Download, Calculator, Leaf, FileSpreadsheet, Archive } from 'lucide-react';
import { EmissionEntry, QuestionnaireData } from '../../types/ghg';
import { exportToExcel, ExportData } from '../../utils/excelExport';

interface GHGResultsProps {
  questionnaire: QuestionnaireData;
  entries: EmissionEntry[];
  totalEmissions: number;
  emissionFactors: any;
  onBackToCalculator: () => void;
}

const GHGResults: React.FC<GHGResultsProps> = ({
  questionnaire,
  entries,
  totalEmissions,
  emissionFactors,
  onBackToCalculator
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv'>('excel');

  // Calculate emissions by unit
  const emissionsByUnit = questionnaire.selectedUnits.map(unit => {
    const unitEntries = entries.filter(entry => entry.unit === unit);
    const total = unitEntries.reduce((sum, entry) => sum + entry.emissions, 0);
    return { unit, total, count: unitEntries.length };
  });

  const calculatedUnits = emissionsByUnit.filter(u => u.count > 0).length;

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData: ExportData = {
        questionnaire,
        entries,
        emissionFactors,
        totalEmissions
      };
      
      await exportToExcel(exportData, exportFormat);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Calculation Results</h2>
            <p className="text-gray-600">{questionnaire.orgName} • {entries.length} calculations</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToCalculator}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Calculator</span>
            </button>
            
            {/* Export Format Selection */}
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'excel' | 'csv')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV Files (.zip)</option>
            </select>
            
            <button 
              onClick={handleExport}
              disabled={isExporting || entries.length === 0}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  {exportFormat === 'excel' ? <FileSpreadsheet className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  <span>Export Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Export Information */}
        {entries.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Export Report Contents:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
              <div>
                <strong>Questionnaire Sheet:</strong> Organization details and assessment scope
              </div>
              <div>
                <strong>Summary Sheet:</strong> Total emissions and key metrics
              </div>
              <div>
                <strong>Calculations Sheet:</strong> Detailed emission calculations ({entries.length} entries)
              </div>
              <div>
                <strong>Unit Breakdown Sheet:</strong> Emissions by textile unit ({questionnaire.selectedUnits.length} units)
              </div>
              {Object.values(emissionFactors).some(scope => 
                Object.values(scope).some(category => 
                  Object.values(category).some(fuel => 
                    typeof fuel === 'object' && fuel.custom
                  )
                )
              ) && (
                <div>
                  <strong>Custom Fuels Sheet:</strong> User-defined emission factors
                </div>
              )}
            </div>
          </div>
        )}

        {/* Green Banner with Plant Logo */}
        <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-xl p-8 text-white overflow-hidden mb-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 right-20 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute top-12 right-32 w-12 h-12 border border-white rounded-full"></div>
            <div className="absolute bottom-8 right-24 w-6 h-6 bg-white rounded-full"></div>
            <div className="absolute top-16 right-8 w-8 h-8 border border-white rounded-full"></div>
            <div className="absolute bottom-12 right-40 w-4 h-4 bg-white rounded-full"></div>
          </div>
          
          {/* Plant/Leaf Icon */}
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-30">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 grid grid-cols-3 gap-8">
            {/* Units Calculated */}
            <div>
              <h3 className="text-lg font-bold mb-2 text-white">Units Calculated</h3>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-4xl font-bold">{calculatedUnits}</span>
              </div>
              <p className="text-green-100 text-sm">of {questionnaire.selectedUnits.length} units</p>
            </div>

            {/* Total Activities */}
            <div>
              <h3 className="text-lg font-bold mb-2 text-white">Total Activities</h3>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-4xl font-bold">{entries.length}</span>
              </div>
              <p className="text-green-100 text-sm">emission sources</p>
            </div>

            {/* Total CO2 Equivalent */}
            <div>
              <h3 className="text-lg font-bold mb-2 text-white">Total CO₂ Equivalent</h3>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-4xl font-bold">{(totalEmissions / 1000).toFixed(2)}</span>
                <span className="text-lg font-medium">tonnes</span>
              </div>
              <p className="text-green-100 text-sm">carbon footprint</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Detailed Calculations</h3>
        </div>
        
        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No calculations available</h4>
            <p className="text-gray-600">Go back to the calculator to add emission calculations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Unit</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Scope</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Fuel Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Emission Factor</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Total Emissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{entry.unit}</td>
                    <td className="p-4 text-gray-600">{entry.scope}</td>
                    <td className="p-4 text-gray-600">
                      {entry.category && `${entry.category} • `}{entry.fuelCategory}
                    </td>
                    <td className="p-4 text-gray-900">{entry.fuelType}</td>
                    <td className="p-4 text-gray-600">{entry.amount} {entry.unit_type}</td>
                    <td className="p-4 text-gray-600">{entry.convertedFactor.toFixed(6)} kg CO2e/{entry.unit_type}</td>
                    <td className="p-4 font-medium text-gray-900">{entry.emissions.toFixed(2)} kg CO2e</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Emissions by Unit */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Emissions by Unit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emissionsByUnit.map((unitData) => (
            <div key={unitData.unit} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900">{unitData.unit}</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">{unitData.total.toFixed(2)} kg CO2e</p>
              <p className="text-sm text-gray-600">{unitData.count} calculations</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${totalEmissions > 0 ? (unitData.total / totalEmissions) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {totalEmissions > 0 ? ((unitData.total / totalEmissions) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GHGResults;