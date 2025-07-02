import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserLayout from './components/UserLayout';
import Dashboard from './pages/Dashboard';
import SupplyChain from './pages/SupplyChain';
import Measurements from './pages/Measurements';
import ActivityData from './pages/ActivityData';
import Footprints from './pages/Footprints';
import Overview from './pages/Overview';
import Drilldown from './pages/Drilldown';
import ProductsAndMaterials from './pages/ProductsAndMaterials';
import Benchmarks from './pages/Benchmarks';
import DisclosuresAndReports from './pages/DisclosuresAndReports';
import ReductionPlans from './pages/ReductionPlans';
import Marketplace from './pages/Marketplace';
import ExcelUpload from './pages/ExcelUpload';
import GHGCalculator from './pages/GHGCalculator';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public Route - Login */}
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/home" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Dashboard />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/excel-upload" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <ExcelUpload />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/ghg-calculator" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <GHGCalculator />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/supply-chain" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <SupplyChain />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/measurements" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Measurements />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/activity-data" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <ActivityData />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/footprints" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Footprints />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/overview" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Overview />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/drilldown" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Drilldown />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/products-and-materials" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <ProductsAndMaterials />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/benchmarks" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Benchmarks />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/disclosures-and-reports" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <DisclosuresAndReports />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reduction-plans" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <ReductionPlans />
                </UserLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/marketplace" element={
              <ProtectedRoute requiredRole="user">
                <UserLayout>
                  <Marketplace />
                </UserLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;