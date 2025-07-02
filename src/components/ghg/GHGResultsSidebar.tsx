import React from 'react';
import { Lightbulb, Leaf } from 'lucide-react';
import { EmissionEntry } from '../../types/ghg';

interface GHGResultsSidebarProps {
  entries: EmissionEntry[];
  totalEmissions: number;
}

const GHGResultsSidebar: React.FC<GHGResultsSidebarProps> = ({
  entries,
  totalEmissions
}) => {
  return (
    <div className="space-y-6">
      {/* Current Session Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Current Session
        </h3>
        
        {entries.length === 0 ? (
          <p className="text-gray-600 text-sm">No calculations yet</p>
        ) : (
          <div className="space-y-3">
            {entries.slice(-5).map(entry => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{entry.fuelType}</p>
                <p className="text-sm text-gray-600">{entry.scope} • {entry.fuelCategory}</p>
                <p className="text-sm text-gray-900">
                  {entry.amount} {entry.unit_type} = <span className="font-medium">{entry.emissions.toFixed(2)} kg CO2e</span>
                </p>
              </div>
            ))}
            {entries.length > 5 && (
              <p className="text-xs text-gray-500 text-center">
                Showing last 5 calculations
              </p>
            )}
          </div>
        )}
      </div>

      {/* Total Summary - New Design */}
      <div className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 rounded-xl p-6 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute top-8 right-8 w-8 h-8 border border-white rounded-full"></div>
          <div className="absolute bottom-6 right-12 w-4 h-4 bg-white rounded-full"></div>
        </div>
        
        {/* Leaf Icon */}
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Leaf className="w-8 h-8 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2 text-white">Total CO₂ Equivalent</h3>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-3xl font-bold">{(totalEmissions / 1000).toFixed(2)}</span>
            <span className="text-lg font-medium">tonnes</span>
          </div>
          <p className="text-green-100 text-sm">{entries.length} activities calculated</p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-blue-900">Quick Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Use consistent units for accurate calculations</li>
          <li>• Add custom fuel types for specific materials</li>
          <li>• Calculate all emission sources for comprehensive assessment</li>
          <li>• Review results before generating final report</li>
        </ul>
      </div>
    </div>
  );
};

export default GHGResultsSidebar;