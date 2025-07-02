import { useState, useEffect } from 'react';
import { QuestionnaireData, EmissionEntry, CalculationState, EmissionFactorsDatabase } from '../types/ghg';
import { initialEmissionFactors, unitConversions } from '../data/emissionFactors';

export const useGHGCalculator = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'calculator' | 'results'>('questionnaire');
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactorsDatabase>(initialEmissionFactors);
  
  // Questionnaire state
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData>({
    orgName: '',
    boundaryApproach: '',
    controlSubtype: '',
    operationalBoundary: '',
    emissionSources: '',
    timestamp: ''
  });

  // Calculator state - Initialize with default values
  const [entries, setEntries] = useState<EmissionEntry[]>([]);
  const [currentCalculation, setCurrentCalculation] = useState<CalculationState>({
    scope: 'Scope 1',
    category: 'Stationary',
    fuelCategory: 'Gaseous Fuels',
    fuelType: 'Compressed Natural Gas',
    amount: 0,
    unit: 'kg'
  });

  // Custom fuel management
  const [customFuel, setCustomFuel] = useState({
    name: '',
    factor: 0
  });

  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

  // Auto-match scope based on questionnaire selection
  useEffect(() => {
    if (questionnaire.emissionSources) {
      let targetScope = 'Scope 1';
      
      if (questionnaire.emissionSources.includes('Scope 1')) {
        targetScope = 'Scope 1';
      } else if (questionnaire.emissionSources.includes('Scope 2')) {
        targetScope = 'Scope 2';
      }
      
      setCurrentCalculation(prev => ({
        ...prev,
        scope: targetScope
      }));
    }
  }, [questionnaire.emissionSources]);

  // Update dependent dropdowns when scope changes
  useEffect(() => {
    if (currentCalculation.scope === 'Scope 1') {
      setCurrentCalculation(prev => ({
        ...prev,
        category: 'Stationary',
        fuelCategory: 'Gaseous Fuels',
        fuelType: 'Compressed Natural Gas'
      }));
    } else {
      setCurrentCalculation(prev => ({
        ...prev,
        category: '',
        fuelCategory: 'Electricity',
        fuelType: 'Grid Average'
      }));
    }
  }, [currentCalculation.scope]);

  // Questionnaire validation
  const validateQuestionnaire = (): boolean => {
    const newErrors: string[] = [];
    
    if (!questionnaire.orgName) newErrors.push("Organization name is required");
    if (!questionnaire.boundaryApproach) newErrors.push("Organizational boundary is required");
    if (questionnaire.boundaryApproach === 'Control Approach' && !questionnaire.controlSubtype) {
      newErrors.push("Control Approach type is required");
    }
    if (!questionnaire.operationalBoundary) newErrors.push("Operational Boundary is required");
    if (!questionnaire.emissionSources) newErrors.push("Emission sources must be selected");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Submit questionnaire and move to calculator
  const submitQuestionnaire = () => {
    if (validateQuestionnaire()) {
      setQuestionnaire(prev => ({
        ...prev,
        timestamp: new Date().toISOString()
      }));
      setCurrentStep('calculator');
    }
  };

  // Get current emission factor
  const getCurrentEmissionFactor = (): number => {
    try {
      if (currentCalculation.scope === 'Scope 1') {
        const factor = emissionFactors[currentCalculation.scope]?.[currentCalculation.category]?.[currentCalculation.fuelCategory]?.[currentCalculation.fuelType]?.factor;
        return factor || 0;
      } else {
        const factor = emissionFactors[currentCalculation.scope]?.[currentCalculation.fuelCategory]?.[currentCalculation.fuelType]?.factor;
        return factor || 0;
      }
    } catch (error) {
      console.error('Error getting emission factor:', error);
      return 0;
    }
  };

  // Calculate emissions
  const calculateEmissions = () => {
    if (!currentCalculation.amount || currentCalculation.amount <= 0) {
      setErrors(['Please enter a valid amount']);
      return;
    }

    const baseFactor = getCurrentEmissionFactor();
    if (baseFactor === 0) {
      setErrors(['Invalid emission factor. Please check your selection.']);
      return;
    }

    const convertedFactor = baseFactor * (unitConversions[currentCalculation.unit] || 1);
    const emissions = currentCalculation.amount * convertedFactor;

    const entry: EmissionEntry = {
      id: Date.now().toString(),
      scope: currentCalculation.scope,
      category: currentCalculation.category,
      fuelCategory: currentCalculation.fuelCategory,
      fuelType: currentCalculation.fuelType,
      amount: currentCalculation.amount,
      unit_type: currentCalculation.unit,
      baseFactor,
      convertedFactor,
      emissions,
      timestamp: new Date().toISOString()
    };

    setEntries(prev => [...prev, entry]);
    // Reset amount to 0 after calculation
    setCurrentCalculation(prev => ({ ...prev, amount: 0 }));
    setErrors([]);
  };

  // Add custom fuel type
  const addCustomFuel = () => {
    if (!customFuel.name.trim() || customFuel.factor <= 0) {
      setErrors(['Please enter a valid fuel name and emission factor']);
      return;
    }

    const newEmissionFactors = JSON.parse(JSON.stringify(emissionFactors)); // Deep clone
    
    try {
      if (currentCalculation.scope === 'Scope 1') {
        if (!newEmissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][customFuel.name]) {
          newEmissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][customFuel.name] = {
            factor: customFuel.factor,
            custom: true,
            timestamp: new Date().toISOString()
          };
        }
      } else {
        if (!newEmissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][customFuel.name]) {
          newEmissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][customFuel.name] = {
            factor: customFuel.factor,
            custom: true,
            timestamp: new Date().toISOString()
          };
        }
      }

      setEmissionFactors(newEmissionFactors);
      setCurrentCalculation(prev => ({ ...prev, fuelType: customFuel.name }));
      // Reset custom fuel form
      setCustomFuel({ name: '', factor: 0 });
      setErrors([]);
    } catch (error) {
      console.error('Error adding custom fuel:', error);
      setErrors(['Failed to add custom fuel. Please try again.']);
    }
  };

  // Delete custom fuel type
  const deleteCustomFuel = (fuelType: string) => {
    const newEmissionFactors = JSON.parse(JSON.stringify(emissionFactors)); // Deep clone
    
    try {
      if (currentCalculation.scope === 'Scope 1') {
        delete newEmissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][fuelType];
      } else {
        delete newEmissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][fuelType];
      }

      setEmissionFactors(newEmissionFactors);
      
      // Select first available fuel type
      const remainingFuels = Object.keys(
        currentCalculation.scope === 'Scope 1' 
          ? newEmissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory]
          : newEmissionFactors[currentCalculation.scope][currentCalculation.fuelCategory]
      );
      
      if (remainingFuels.length > 0) {
        setCurrentCalculation(prev => ({ ...prev, fuelType: remainingFuels[0] }));
      }
    } catch (error) {
      console.error('Error deleting custom fuel:', error);
      setErrors(['Failed to delete custom fuel. Please try again.']);
    }
  };

  // Calculate totals
  const totalEmissions = entries.reduce((sum, entry) => sum + entry.emissions, 0);

  // Navigate to results - ensure we have valid data
  const goToResults = () => {
    console.log('Navigating to results with:', { questionnaire, entries, totalEmissions });
    setCurrentStep('results');
  };

  return {
    // State
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
    
    // Functions
    submitQuestionnaire,
    calculateEmissions,
    addCustomFuel,
    deleteCustomFuel,
    getCurrentEmissionFactor,
    goToResults
  };
};