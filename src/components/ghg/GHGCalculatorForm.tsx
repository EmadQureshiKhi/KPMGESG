import React from 'react';
import { Calculator, Plus, X, AlertCircle } from 'lucide-react';
import { CalculationState, EmissionFactorsDatabase } from '../../types/ghg';
import { unitConversions } from '../../data/emissionFactors';

interface GHGCalculatorFormProps {
  currentCalculation: CalculationState;
  setCurrentCalculation: React.Dispatch<React.SetStateAction<CalculationState>>;
  emissionFactors: EmissionFactorsDatabase;
  customFuel: { name: string; factor: number };
  setCustomFuel: React.Dispatch<React.SetStateAction<{ name: string; factor: number }>>;
  errors: string[];
  onCalculate: () => void;
  onAddCustomFuel: () => void;
  onDeleteCustomFuel: (fuelType: string) => void;
  getCurrentEmissionFactor: () => number;
}

const GHGCalculatorForm: React.FC<GHGCalculatorFormProps> = ({
  currentCalculation,
  setCurrentCalculation,
  emissionFactors,
  customFuel,
  setCustomFuel,
  errors,
  onCalculate,
  onAddCustomFuel,
  onDeleteCustomFuel,
  getCurrentEmissionFactor
}) => {
  // Get available options for dropdowns
  const getAvailableOptions = () => {
    try {
      if (currentCalculation.scope === 'Scope 1') {
        const categories = Object.keys(emissionFactors[currentCalculation.scope] || {});
        const fuelCategories = Object.keys(emissionFactors[currentCalculation.scope][currentCalculation.category] || {});
        const fuelTypes = Object.keys(emissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory] || {});
        
        return { categories, fuelCategories, fuelTypes };
      } else {
        const fuelCategories = Object.keys(emissionFactors[currentCalculation.scope] || {});
        const fuelTypes = Object.keys(emissionFactors[currentCalculation.scope][currentCalculation.fuelCategory] || {});
        
        return { categories: [], fuelCategories, fuelTypes };
      }
    } catch {
      return { categories: [], fuelCategories: [], fuelTypes: [] };
    }
  };

  const { categories, fuelCategories, fuelTypes } = getAvailableOptions();

  // Handle number input changes to prevent sticky zeros
  const handleAmountChange = (value: string) => {
    if (value === '') {
      setCurrentCalculation(prev => ({ ...prev, amount: 0 }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setCurrentCalculation(prev => ({ ...prev, amount: numValue }));
      }
    }
  };

  const handleCustomFactorChange = (value: string) => {
    if (value === '') {
      setCustomFuel(prev => ({ ...prev, factor: 0 }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setCustomFuel(prev => ({ ...prev, factor: numValue }));
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Emission Calculation</h3>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 text-sm">{errors[0]}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Scope Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
          <select
            value={currentCalculation.scope}
            onChange={(e) => setCurrentCalculation(prev => ({ ...prev, scope: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Scope 1">Scope 1</option>
            <option value="Scope 2">Scope 2</option>
          </select>
        </div>

        {/* Category Selection (Scope 1 only) */}
        {currentCalculation.scope === 'Scope 1' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={currentCalculation.category}
              onChange={(e) => setCurrentCalculation(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}

        {/* Fuel Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Category</label>
          <select
            value={currentCalculation.fuelCategory}
            onChange={(e) => setCurrentCalculation(prev => ({ ...prev, fuelCategory: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fuelCategories.map(fuelCategory => (
              <option key={fuelCategory} value={fuelCategory}>{fuelCategory}</option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
          <select
            value={currentCalculation.fuelType}
            onChange={(e) => setCurrentCalculation(prev => ({ ...prev, fuelType: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fuelTypes.map(fuelType => (
              <option key={fuelType} value={fuelType}>{fuelType}</option>
            ))}
          </select>
        </div>

        {/* Custom Fuel Management */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Manage Fuel Types</h4>
          
          {/* Add Custom Fuel */}
          <div className="space-y-3 mb-4">
            <h5 className="text-sm font-medium text-gray-700">Add New Custom Fuel Type</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fuel Name</label>
                <input
                  type="text"
                  value={customFuel.name}
                  onChange={(e) => setCustomFuel(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter fuel name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Emission Factor (kg CO2e/unit)</label>
                <input
                  type="number"
                  value={customFuel.factor === 0 ? '' : customFuel.factor}
                  onChange={(e) => handleCustomFactorChange(e.target.value)}
                  placeholder="Enter emission factor"
                  min="0"
                  step="0.001"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={onAddCustomFuel}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Fuel</span>
            </button>
          </div>

          {/* Delete Custom Fuel */}
          {fuelTypes.some(ft => {
            try {
              if (currentCalculation.scope === 'Scope 1') {
                return emissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][ft]?.custom;
              } else {
                return emissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][ft]?.custom;
              }
            } catch {
              return false;
            }
          }) && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Delete Custom Fuel Type</h5>
              <button
                onClick={() => onDeleteCustomFuel(currentCalculation.fuelType)}
                disabled={!(() => {
                  try {
                    if (currentCalculation.scope === 'Scope 1') {
                      return emissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][currentCalculation.fuelType]?.custom;
                    } else {
                      return emissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][currentCalculation.fuelType]?.custom;
                    }
                  } catch {
                    return false;
                  }
                })()}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            </div>
          )}
        </div>

        {/* Activity Data */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Activity Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={currentCalculation.amount === 0 ? '' : currentCalculation.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={currentCalculation.unit}
                onChange={(e) => setCurrentCalculation(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.keys(unitConversions).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Emission Factor Display */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Emission Factor:</span> {getCurrentEmissionFactor()} kg CO2e/unit
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={onCalculate}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <Calculator className="w-5 h-5" />
          <span>Calculate Emissions</span>
        </button>
      </div>
    </div>
  );
};

export default GHGCalculatorForm;