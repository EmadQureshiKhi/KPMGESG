import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { versionChecker } from './utils/versionCheck';

// Start version checking for automatic updates
console.log('🚀 Starting KPMG ESG Analytics Platform...');
versionChecker.startChecking();

// Add manual check for testing (only in development)
if (import.meta.env.DEV) {
  (window as any).checkForUpdates = () => versionChecker.checkNow();
  console.log('🔧 Development mode: Use checkForUpdates() in console to test notifications');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);