import React from 'react';
import { Calculator } from 'lucide-react';
import { useGHGCalculator } from '../hooks/useGHGCalculator';
import GHGQuestionnaire from '../components/ghg/GHGQuestionnaire';
import GHGCalculatorForm from '../components/ghg/GHGCalculatorForm';
import GHGResultsSidebar from '../components/ghg/GHGResultsSidebar';
import GHGResults from '../components/ghg/GHGResults';

const GHGCalculator: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
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
    goToResults
  } = useGHGCalculator();

  console.log('GHGCalculator render - Current step:', currentStep);
  console.log('GHGCalculator render - Entries:', entries.length);
  console.log('GHGCalculator render - Questionnaire:', questionnaire);

  if (currentStep === 'questionnaire') {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GHG Emissions Calculator</h1>
          <p className="text-gray-600">
            Comprehensive greenhouse gas emissions assessment for your organization
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
    console.log('Rendering results page with:', { questionnaire, entries: entries.length, totalEmissions });
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
              Calculate greenhouse gas emissions for your organization
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{questionnaire.orgName || 'Organization'}</span> • {entries.length} calculations
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentStep('questionnaire')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-2"
            >
              <span>Back to Questionnaire</span>
            </button>
            <button
              onClick={goToResults}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View All Results
            </button>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Assessment Configuration:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Organizational Boundary:</span>
              <p className="font-medium">{questionnaire.boundaryApproach || 'Not set'}</p>
              {questionnaire.controlSubtype && (
                <p className="text-gray-600">→ {questionnaire.controlSubtype}</p>
              )}
            </div>
            <div>
              <span className="text-gray-600">Operational Boundary:</span>
              <p className="font-medium">{questionnaire.operationalBoundary || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-600">Emission Sources:</span>
              <p className="font-medium">{questionnaire.emissionSources || 'Not set'}</p>
            </div>
            <div>
              <span className="text-gray-600">Total Calculations:</span>
              <p className="font-medium">{entries.length} activities</p>
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
            questionnaireScope={questionnaire.emissionSources}
          />
        </div>

        {/* Results Sidebar */}
        <div>
          <GHGResultsSidebar
            entries={entries}
            totalEmissions={totalEmissions}
          />
        </div>
      </div>
    </div>
  );
};

export default GHGCalculator;