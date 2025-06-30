import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExcelUploadResponse } from '../services/api';

interface DataContextType {
  uploadedData: ExcelUploadResponse | null;
  setUploadedData: (data: ExcelUploadResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedData, setUploadedData] = useState<ExcelUploadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DataContext.Provider value={{
      uploadedData,
      setUploadedData,
      isLoading,
      setIsLoading
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