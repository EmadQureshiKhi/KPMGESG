import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ExcelUploadResponse } from '../services/api';
import { useDataPersistence } from './DataPersistenceContext';

interface DataContextType {
  uploadedData: ExcelUploadResponse | null;
  setUploadedData: (data: ExcelUploadResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // Additional data management methods
  saveUploadedData: (data: ExcelUploadResponse) => void;
  loadUploadedData: () => void;
  clearUploadedData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedData, setUploadedData] = useState<ExcelUploadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { saveData, loadData, removeData } = useDataPersistence();

  // Load data on component mount
  useEffect(() => {
    loadUploadedData();
  }, []);

  // Save uploaded data to localStorage
  const saveUploadedData = (data: ExcelUploadResponse) => {
    setUploadedData(data);
    saveData('uploaded_excel_data', data);
  };

  // Load uploaded data from localStorage
  const loadUploadedData = () => {
    const savedData = loadData('uploaded_excel_data');
    if (savedData) {
      setUploadedData(savedData);
      console.log('Loaded uploaded data from localStorage');
    }
  };

  // Clear uploaded data
  const clearUploadedData = () => {
    setUploadedData(null);
    removeData('uploaded_excel_data');
  };

  // Enhanced setUploadedData that also saves to localStorage
  const enhancedSetUploadedData = (data: ExcelUploadResponse | null) => {
    if (data) {
      saveUploadedData(data);
    } else {
      clearUploadedData();
    }
  };

  return (
    <DataContext.Provider value={{
      uploadedData,
      setUploadedData: enhancedSetUploadedData,
      isLoading,
      setIsLoading,
      saveUploadedData,
      loadUploadedData,
      clearUploadedData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};