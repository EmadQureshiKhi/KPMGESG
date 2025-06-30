import React from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Afraz!</h1>
            <p className="text-blue-100 text-lg">
              Here's your carbon footprint overview for KPMG.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Emissions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">420,020</p>
              <p className="text-sm text-gray-500 mt-1">tCO₂e</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">97</p>
              <p className="text-sm text-green-600 mt-1">+5 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reduction Target</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">42%</p>
              <p className="text-sm text-blue-600 mt-1">by 2030</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SBTi Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Validated</p>
              <p className="text-sm text-green-600 mt-1">Committed</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emissions Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Emissions Overview</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">2022</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">2021</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">2020</button>
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-600">Emissions trend visualization</p>
              <p className="text-sm text-gray-500">Chart showing scope 1, 2, and 3 emissions</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">View Supply Chain</span>
              <span className="text-xs text-gray-500">97 suppliers</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">Update Measurements</span>
              <span className="text-xs text-gray-500">Last: 2 days ago</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">Generate Report</span>
              <span className="text-xs text-gray-500">CDP, GRI</span>
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">Set Targets</span>
              <span className="text-xs text-gray-500">SBTi aligned</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;