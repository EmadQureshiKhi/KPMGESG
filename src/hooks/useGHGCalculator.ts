import { useState, useEffect } from 'react';
import { QuestionnaireData, EmissionEntry, CalculationState, EmissionFactorsDatabase } from '../types/ghg';
import { initialEmissionFactors, unitConversions } from '../data/emissionFactors';

export const useGHGCalculator = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'calculator' | 'results'>('questionnaire');
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactorsDatabase>(initialEmissionFactors);
  
  // Questionnaire state
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireData>({
    orgName: '',
    boundaryApproach: '',
    controlSubtype: '',
    operationalBoundary: '',
    selectedUnits: [],
    emissionSources: '',
    timestamp: ''
  });

  // Calculator state
  const [entries, setEntries] = useState<EmissionEntry[]>([]);
  const [currentCalculation, setCurrentCalculation] = useState<CalculationState>({
    scope: 'Scope 1',
    category: 'Stationary',
    fuelCategory: 'Gaseous Fuels',
    fuelType: 'Compressed Natural Gas',
    amount: 0,
    unit: 'kg'
  });

  // Custom fuel management - Fix initial state
  const [customFuel, setCustomFuel] = useState({
    name: '',
    factor: 0
  });

  // Validation errors
  const [errors, setErrors] = useState<string[]>([]);

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

  // Update fuel types when category or fuel category changes
  useEffect(() => {
    try {
      if (currentCalculation.scope === 'Scope 1') {
        const fuelTypes = Object.keys(
          emissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory] || {}
        );
        if (fuelTypes.length > 0) {
          setCurrentCalculation(prev => ({ ...prev, fuelType: fuelTypes[0] }));
        }
      } else {
        const fuelTypes = Object.keys(
          emissionFactors[currentCalculation.scope][currentCalculation.fuelCategory] || {}
        );
        if (fuelTypes.length > 0) {
          setCurrentCalculation(prev => ({ ...prev, fuelType: fuelTypes[0] }));
        }
      }
    } catch (error) {
      console.error('Error updating fuel types:', error);
    }
  }, [currentCalculation.scope, currentCalculation.category, currentCalculation.fuelCategory, emissionFactors]);

  // Questionnaire validation
  const validateQuestionnaire = (): boolean => {
    const newErrors: string[] = [];
    
    if (!questionnaire.orgName) newErrors.push("Organization name is required");
    if (!questionnaire.boundaryApproach) newErrors.push("Organizational boundary is required");
    if (questionnaire.boundaryApproach === 'Control Approach' && !questionnaire.controlSubtype) {
      newErrors.push("Control Approach type is required");
    }
    if (!questionnaire.operationalBoundary) newErrors.push("Operational Boundary is required");
    if (questionnaire.selectedUnits.length === 0) newErrors.push("At least one textile unit must be selected");
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
      setCurrentUnitIndex(0);
    }
  };

  // Get current emission factor
  const getCurrentEmissionFactor = (): number => {
    try {
      if (currentCalculation.scope === 'Scope 1') {
        return emissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][currentCalculation.fuelType]?.factor || 0;
      } else {
        return emissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][currentCalculation.fuelType]?.factor || 0;
      }
    } catch {
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
    const convertedFactor = baseFactor * (unitConversions[currentCalculation.unit] || 1);
    const emissions = currentCalculation.amount * convertedFactor;

    const entry: EmissionEntry = {
      id: Date.now().toString(),
      unit: questionnaire.selectedUnits[currentUnitIndex],
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

    const newEmissionFactors = { ...emissionFactors };
    
    if (currentCalculation.scope === 'Scope 1') {
      if (!newEmissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][customFuel.name]) {
        newEmissionFactors[currentCalculation.scope][currentCalculation.category][currentCalculation.fuelCategory][customFuel.name] = {
          factor: customFuel.factor,
          custom: true
        };
      }
    } else {
      if (!newEmissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][customFuel.name]) {
        newEmissionFactors[currentCalculation.scope][currentCalculation.fuelCategory][customFuel.name] = {
          factor: customFuel.factor,
          custom: true
        };
      }
    }

    setEmissionFactors(newEmissionFactors);
    setCurrentCalculation(prev => ({ ...prev, fuelType: customFuel.name }));
    // Reset custom fuel form
    setCustomFuel({ name: '', factor: 0 });
    setErrors([]);
  };

  // Delete custom fuel type
  const deleteCustomFuel = (fuelType: string) => {
    const newEmissionFactors = { ...emissionFactors };
    
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
  };

  // Navigation functions
  const goToNextUnit = () => {
    if (currentUnitIndex < questionnaire.selectedUnits.length - 1) {
      setCurrentUnitIndex(currentUnitIndex + 1);
    }
  };

  const goToPreviousUnit = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex(currentUnitIndex - 1);
    }
  };

  // Calculate totals
  const totalEmissions = entries.reduce((sum, entry) => sum + entry.emissions, 0);

  return {
    // State
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
    
    // Functions
    submitQuestionnaire,
    calculateEmissions,
    addCustomFuel,
    deleteCustomFuel,
    getCurrentEmissionFactor,
    goToNextUnit,
    goToPreviousUnit
  };
};
