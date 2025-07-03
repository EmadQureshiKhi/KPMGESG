import { useState, useEffect } from 'react';
import { QuestionnaireData, EmissionEntry, CalculationState, EmissionFactorsDatabase } from '../types/ghg';
import { initialEmissionFactors, unitConversions } from '../data/emissionFactors';
import { useDataPersistence } from '../contexts/DataPersistenceContext';

export const useGHGCalculator = () => {
  const { saveData, loadData, removeData } = useDataPersistence();
  
  // State management
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'calculator' | 'results'>('questionnaire');
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactorsDatabase>(initialEmissionFactors);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
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

  // Load data from localStorage on component mount
  useEffect(() => {
    loadGHGData();
  }, []);

  // Save data to localStorage whenever state changes (but only after initial load)
  useEffect(() => {
    if (isDataLoaded) {
      saveGHGData();
    }
  }, [questionnaire, entries, emissionFactors, currentStep, isDataLoaded]);

  // Load GHG data from localStorage
  const loadGHGData = () => {
    try {
      console.log('Loading GHG data from localStorage...');
      
      const savedQuestionnaire = loadData('ghg_questionnaire');
      const savedEntries = loadData('ghg_entries');
      const savedEmissionFactors = loadData('ghg_emission_factors');
      const savedCurrentStep = loadData('ghg_current_step');

      if (savedQuestionnaire && savedQuestionnaire.orgName) {
        setQuestionnaire(savedQuestionnaire);
        console.log('✅ Loaded GHG questionnaire:', savedQuestionnaire);
      }

      if (savedEntries && Array.isArray(savedEntries) && savedEntries.length > 0) {
        setEntries(savedEntries);
        console.log(`✅ Loaded ${savedEntries.length} GHG entries:`, savedEntries);
      }

      if (savedEmissionFactors) {
        setEmissionFactors(savedEmissionFactors);
        console.log('✅ Loaded custom emission factors');
      }

      if (savedCurrentStep && (savedCurrentStep === 'calculator' || savedCurrentStep === 'results')) {
        // Only restore to calculator or results if we have questionnaire data
        if (savedQuestionnaire && savedQuestionnaire.orgName) {
          setCurrentStep(savedCurrentStep);
          console.log(`✅ Restored to step: ${savedCurrentStep}`);
        }
      }

      setIsDataLoaded(true);
      console.log('✅ GHG data loading complete');
    } catch (error) {
      console.error('❌ Error loading GHG data from localStorage:', error);
      setIsDataLoaded(true);
    }
  };

  // Save GHG data to localStorage
  const saveGHGData = () => {
    try {
      saveData('ghg_questionnaire', questionnaire);
      saveData('ghg_entries', entries);
      saveData('ghg_emission_factors', emissionFactors);
      saveData('ghg_current_step', currentStep);
      console.log('💾 GHG data saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving GHG data to localStorage:', error);
    }
  };

  // Auto-match scope based on questionnaire selection
  useEffect(() => {
    if (questionnaire.emissionSources && isDataLoaded) {
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
  }, [questionnaire.emissionSources, isDataLoaded]);

  // Update dependent dropdowns when scope changes
  useEffect(() => {
    if (isDataLoaded) {
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
    }
  }, [currentCalculation.scope, isDataLoaded]);

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
      const updatedQuestionnaire = {
        ...questionnaire,
        timestamp: new Date().toISOString()
      };
      setQuestionnaire(updatedQuestionnaire);
      setCurrentStep('calculator');
      console.log('✅ Questionnaire submitted, moving to calculator');
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

    setEntries(prev => {
      const newEntries = [...prev, entry];
      console.log('✅ New emission entry added:', entry);
      console.log(`📊 Total entries: ${newEntries.length}`);
      return newEntries;
    });
    
    // Reset amount to 0 after calculation
    setCurrentCalculation(prev => ({ ...prev, amount: 0 }));
    setErrors([]);
  };

  // Delete emission entry
  const deleteEntry = (entryId: string) => {
    setEntries(prev => {
      const newEntries = prev.filter(entry => entry.id !== entryId);
      console.log('🗑️ Entry deleted:', entryId);
      console.log(`📊 Remaining entries: ${newEntries.length}`);
      return newEntries;
    });
  };

  // Delete all entries
  const deleteAllEntries = () => {
    setEntries([]);
    console.log('🗑️ All entries deleted');
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
      console.log('✅ Custom fuel added:', customFuel.name);
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
      console.log('✅ Custom fuel deleted:', fuelType);
    } catch (error) {
      console.error('Error deleting custom fuel:', error);
      setErrors(['Failed to delete custom fuel. Please try again.']);
    }
  };

  // Calculate totals
  const totalEmissions = entries.reduce((sum, entry) => sum + entry.emissions, 0);

  // Navigate to results - ensure we have valid data
  const goToResults = () => {
    console.log('🔄 Navigating to results with:', { 
      questionnaire: questionnaire.orgName, 
      entries: entries.length, 
      totalEmissions 
    });
    setCurrentStep('results');
  };

  // Clear all GHG data (useful for starting fresh)
  const clearAllGHGData = () => {
    setQuestionnaire({
      orgName: '',
      boundaryApproach: '',
      controlSubtype: '',
      operationalBoundary: '',
      emissionSources: '',
      timestamp: ''
    });
    setEntries([]);
    setEmissionFactors(initialEmissionFactors);
    setCurrentStep('questionnaire');
    setErrors([]);
    console.log('🗑️ All GHG data cleared');
  };

  // Reset everything and go back to questionnaire
  const resetToQuestionnaire = () => {
    // Clear all data from localStorage
    removeData('ghg_questionnaire');
    removeData('ghg_entries');
    removeData('ghg_emission_factors');
    removeData('ghg_current_step');
    
    // Reset all state
    clearAllGHGData();
    
    console.log('🔄 Reset to questionnaire - all data cleared from localStorage');
  };

  // Force refresh data (useful for debugging)
  const refreshGHGData = () => {
    setIsDataLoaded(false);
    loadGHGData();
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
    isDataLoaded,
    
    // Functions
    submitQuestionnaire,
    calculateEmissions,
    deleteEntry,
    deleteAllEntries,
    addCustomFuel,
    deleteCustomFuel,
    getCurrentEmissionFactor,
    goToResults,
    clearAllGHGData,
    resetToQuestionnaire,
    loadGHGData,
    saveGHGData,
    refreshGHGData
  };
};