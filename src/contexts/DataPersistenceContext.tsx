import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface DataPersistenceContextType {
  saveData: (key: string, data: any) => void;
  loadData: (key: string) => any;
  removeData: (key: string) => void;
  clearUserData: () => void;
  getUserDataKeys: () => string[];
}

const DataPersistenceContext = createContext<DataPersistenceContextType | undefined>(undefined);

export const DataPersistenceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Generate user-specific storage key
  const getUserKey = (key: string): string => {
    const userId = user?.id || 'guest';
    return `kpmg_esg_${userId}_${key}`;
  };

  // Save data to localStorage with user-specific key
  const saveData = (key: string, data: any) => {
    try {
      const userKey = getUserKey(key);
      const serializedData = JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
        version: '1.0'
      });
      localStorage.setItem(userKey, serializedData);
      console.log(`Data saved to localStorage: ${userKey}`);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  };

  // Load data from localStorage with user-specific key
  const loadData = (key: string): any => {
    try {
      const userKey = getUserKey(key);
      const serializedData = localStorage.getItem(userKey);
      
      if (!serializedData) {
        return null;
      }

      const parsedData = JSON.parse(serializedData);
      console.log(`Data loaded from localStorage: ${userKey}`);
      return parsedData.data;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return null;
    }
  };

  // Remove specific data from localStorage
  const removeData = (key: string) => {
    try {
      const userKey = getUserKey(key);
      localStorage.removeItem(userKey);
      console.log(`Data removed from localStorage: ${userKey}`);
    } catch (error) {
      console.error('Error removing data from localStorage:', error);
    }
  };

  // Clear all user data (useful for logout or data reset)
  const clearUserData = () => {
    try {
      const userId = user?.id || 'guest';
      const prefix = `kpmg_esg_${userId}_`;
      
      // Get all localStorage keys
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all user-specific keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Cleared ${keysToRemove.length} user data entries`);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  // Get all user data keys (for debugging or data export)
  const getUserDataKeys = (): string[] => {
    try {
      const userId = user?.id || 'guest';
      const prefix = `kpmg_esg_${userId}_`;
      const userKeys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          userKeys.push(key.replace(prefix, ''));
        }
      }
      
      return userKeys;
    } catch (error) {
      console.error('Error getting user data keys:', error);
      return [];
    }
  };

  return (
    <DataPersistenceContext.Provider value={{
      saveData,
      loadData,
      removeData,
      clearUserData,
      getUserDataKeys
    }}>
      {children}
    </DataPersistenceContext.Provider>
  );
};

export const useDataPersistence = () => {
  const context = useContext(DataPersistenceContext);
  if (context === undefined) {
    throw new Error('useDataPersistence must be used within a DataPersistenceProvider');
  }
  return context;
};