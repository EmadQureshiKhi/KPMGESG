import React from 'react';
import { ArrowLeft, ArrowRight, Calculator } from 'lucide-react';
import { useGHGCalculator } from '../hooks/useGHGCalculator';
import GHGQuestionnaire from '../components/ghg/GHGQuestionnaire';
import GHGCalculatorForm from '../components/ghg/GHGCalculatorForm';
import GHGResultsSidebar from '../components/ghg/GHGResultsSidebar';
import GHGResults from '../components/ghg/GHGResults';

const GHGCalculator: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    currentUnitIndex,
    questionnaire,
    setQuestionnaire,
    entries,
    currentCalculation,
    setCurrentCalculation,
    customFuel,
    setCustomFuel,
    errors,
    emissionFactors,
    totalEmissions,
    submitQuestionnaire,
    calculateEmissions,
    addCustomFuel,
    deleteCustomFuel,
    getCurrentEmissionFactor,
    goToNextUnit,
    goToPreviousUnit
  } = useGHGCalculator();

  if (currentStep === 'questionnaire') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Textile Industry GHG Calculator</h1>
          <p className="text-gray-600">
            Comprehensive greenhouse gas emissions assessment for textile manufacturing
          </p>
        </div>
        
        <GHGQuestionnaire
          questionnaire={questionnaire}
          setQuestionnaire={setQuestionnaire}
          errors={errors}
          onSubmit={submitQuestionnaire}
        />
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <GHGResults
          questionnaire={questionnaire}
          entries={entries}
          totalEmissions={totalEmissions}
          emissionFactors={emissionFactors}
          onBackToCalculator={() => setCurrentStep('calculator')}
        />
      </div>
    );
  }

  // Calculator step
  const currentUnit = questionnaire.selectedUnits[currentUnitIndex];
  const isFirstUnit = currentUnitIndex === 0;
  const isLastUnit = currentUnitIndex === questionnaire.selectedUnits.length - 1;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Green Calculator Logo */}
      <div className="mb-6">
        {/* GHG Calculator Header - Smaller Size */}
        <div className="flex items-center space-x-3 mb-6">
          {/* Green Calculator Icon - Smaller */}
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          
          {/* Title and Subtitle - Smaller */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">GHG Calculator</h1>
            <p className="text-sm text-gray-600">
              Calculating emissions for: <span className="font-semibold text-gray-900">{currentUnit}</span> ({currentUnitIndex + 1} of {questionnaire.selectedUnits.length})
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{questionnaire.orgName}</span> • Unit {currentUnitIndex + 1} of {questionnaire.selectedUnits.length}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentStep('questionnaire')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Questionnaire</span>
            </button>
            <button
              onClick={() => setCurrentStep('results')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View All Results
            </button>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Selected Configuration:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Organizational Boundary:</span>
              <p className="font-medium">{questionnaire.boundaryApproach}</p>
              {questionnaire.controlSubtype && (
                <p className="text-gray-600">→ {questionnaire.controlSubtype}</p>
              )}
            </div>
            <div>
              <span className="text-gray-600">Operational Boundary:</span>
              <p className="font-medium">{questionnaire.operationalBoundary}</p>
            </div>
            <div>
              <span className="text-gray-600">Current Unit:</span>
              <p className="font-medium">{currentUnit}</p>
            </div>
            <div>
              <span className="text-gray-600">Emission Sources:</span>
              <p className="font-medium">{questionnaire.emissionSources}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <GHGCalculatorForm
            currentCalculation={currentCalculation}
            setCurrentCalculation={setCurrentCalculation}
            emissionFactors={emissionFactors}
            customFuel={customFuel}
            setCustomFuel={setCustomFuel}
            errors={errors}
            onCalculate={calculateEmissions}
            onAddCustomFuel={addCustomFuel}
            onDeleteCustomFuel={deleteCustomFuel}
            getCurrentEmissionFactor={getCurrentEmissionFactor}
          />

          {/* Navigation */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Unit Navigation</h3>
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousUnit}
                disabled={isFirstUnit}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Unit</span>
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium text-gray-900">
                  {currentUnitIndex + 1} of {questionnaire.selectedUnits.length}
                </p>
              </div>

              <button
                onClick={goToNextUnit}
                disabled={isLastUnit}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next Unit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Unit Progress Bar */}
            <div className="mt-4">
              <div className="flex space-x-1">
                {questionnaire.selectedUnits.map((unit, index) => (
                  <div
                    key={unit}
                    className={`flex-1 h-2 rounded ${
                      index === currentUnitIndex
                        ? 'bg-blue-600'
                        : index < currentUnitIndex
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                    title={unit}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Start</span>
                <span>Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div>
          <GHGResultsSidebar
            currentUnit={currentUnit}
            entries={entries}
            totalEmissions={totalEmissions}
          />
        </div>
      </div>
    </div>
  );
};

export default GHGCalculator;