import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Download, BarChart3 } from 'lucide-react';
import { uploadExcelFile } from '../services/api';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

const ExcelUpload: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setUploadedData, setIsLoading } = useData();
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFiles = files.filter(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );
    
    if (excelFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...excelFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;
    
    setUploadStatus('uploading');
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Process the first file (you can modify this to handle multiple files)
      const file = uploadedFiles[0];
      const response = await uploadExcelFile(file);
      
      setUploadedData(response);
      setUploadStatus('success');
      
      // Auto-navigate to measurements page after successful upload
      setTimeout(() => {
        navigate('/measurements');
      }, 2000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Excel Data Upload</h1>
          <p className="text-gray-600">
            Upload your Excel files for carbon footprint analysis and ESG reporting
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your Excel files here
                </h3>
                <p className="text-gray-600 mb-4">
                  or click to browse and select files
                </p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Choose Files
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              <div className="text-sm text-gray-500">
                Supported formats: .xlsx, .xls (Max 10MB per file)
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <button
                onClick={handleUpload}
                disabled={uploadStatus === 'uploading'}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    <span>Process Files</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {uploadStatus === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {uploadStatus === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      disabled={uploadStatus === 'uploading'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">Files processed successfully!</p>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your data has been analyzed and is ready for review. Redirecting to measurements page...
            </p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Upload failed</p>
            </div>
            <p className="text-red-700 text-sm mt-1">
              {errorMessage || 'Please check your files and try again. Contact support if the issue persists.'}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported File Types</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Microsoft Excel (.xlsx)</li>
                <li>• Excel 97-2003 (.xls)</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Requirements</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Include column headers</li>
                <li>• Use consistent date formats</li>
                <li>• Ensure numerical data is properly formatted</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Download className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Need a template?</p>
                <p className="text-blue-800 text-sm">
                  Download our Excel template to ensure your data is formatted correctly for analysis.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                  Download Template →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;