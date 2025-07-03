import React, { useState } from 'react';
import { Download, Upload, Trash2, RefreshCw, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDataPersistence } from '../contexts/DataPersistenceContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const DataManagement: React.FC = () => {
  const { user } = useAuth();
  const { saveData, loadData, removeData, clearUserData, getUserDataKeys } = useDataPersistence();
  const { uploadedData, clearUploadedData } = useData();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get all user data keys for display
  const userDataKeys = getUserDataKeys();
  const dataSize = userDataKeys.length;

  // Calculate approximate storage size
  const getStorageSize = (): string => {
    try {
      let totalSize = 0;
      userDataKeys.forEach(key => {
        const data = loadData(key);
        if (data) {
          totalSize += JSON.stringify(data).length;
        }
      });
      
      if (totalSize < 1024) return `${totalSize} bytes`;
      if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
      return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
    } catch {
      return 'Unknown';
    }
  };

  // Export all user data to JSON file
  const exportUserData = async () => {
    setIsExporting(true);
    try {
      const exportData: any = {
        user: {
          id: user?.id,
          username: user?.username,
          name: user?.name,
          role: user?.role
        },
        exportDate: new Date().toISOString(),
        version: '1.0',
        data: {}
      };

      // Collect all user data
      userDataKeys.forEach(key => {
        const data = loadData(key);
        if (data) {
          exportData.data[key] = data;
        }
      });

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kpmg_esg_data_${user?.username}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (error) {
      console.error('Export failed:', error);
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  // Import user data from JSON file
  const importUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        // Validate import data structure
        if (!importData.data || typeof importData.data !== 'object') {
          throw new Error('Invalid data format');
        }

        // Import each data key
        let importedCount = 0;
        Object.entries(importData.data).forEach(([key, data]) => {
          saveData(key, data);
          importedCount++;
        });

        setMessage({ type: 'success', text: `Successfully imported ${importedCount} data entries!` });
        
        // Refresh the page to load new data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } catch (error) {
        console.error('Import failed:', error);
        setMessage({ type: 'error', text: 'Import failed. Please check the file format.' });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  // Clear all user data
  const handleClearAllData = () => {
    clearUserData();
    clearUploadedData();
    setShowClearConfirm(false);
    setMessage({ type: 'success', text: 'All data cleared successfully!' });
    
    // Refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-bold text-gray-900">Data Management</h3>
          <p className="text-sm text-gray-600">Manage your stored data and settings</p>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Data Entries</p>
              <p className="text-lg font-bold text-blue-700">{dataSize}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Storage Size</p>
              <p className="text-lg font-bold text-green-700">{getStorageSize()}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-900">Status</p>
              <p className="text-lg font-bold text-purple-700">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Types */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Stored Data Types:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {userDataKeys.map(key => (
            <div key={key} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
            </div>
          ))}
          {userDataKeys.length === 0 && (
            <p className="text-gray-500 italic">No data stored yet</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Export Data */}
        <button
          onClick={exportUserData}
          disabled={isExporting || dataSize === 0}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export All Data</span>
            </>
          )}
        </button>

        {/* Import Data */}
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={importUserData}
            disabled={isImporting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            disabled={isImporting}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </>
            )}
          </button>
        </div>

        {/* Clear All Data */}
        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={dataSize === 0}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="font-medium text-red-900">Confirm Data Deletion</p>
            </div>
            <p className="text-sm text-red-800 mb-4">
              This will permanently delete all your stored data including GHG calculations, uploaded files, and settings. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleClearAllData}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Data Persistence Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Data is stored locally in your browser</li>
          <li>• Data persists across sessions and page refreshes</li>
          <li>• Each user has separate data storage</li>
          <li>• Export your data regularly for backup</li>
          <li>• Clearing browser data will remove stored information</li>
        </ul>
      </div>
    </div>
  );
};

export default DataManagement;