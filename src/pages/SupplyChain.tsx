import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronDown, 
  ArrowUpDown,
  Grid3X3,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const SupplyChain: React.FC = () => {
  const suppliers = [
    { name: 'Square', priority: 'High', emissions: '9.69%', spend: '$251,090,597', rank: 1, industry: 'Conventional...', targets: 'Scope 3 ta...', status: 'high' },
    { name: 'Uline, Inc.', priority: 'High', emissions: '3.58%', spend: '$25,735,450', rank: 9, industry: 'Machinery...', targets: '+1', status: 'high' },
    { name: 'Lahlout, Inc.', priority: 'High', emissions: '3.30%', spend: '$52,497,656', rank: 10, industry: '', targets: '', status: 'high' },
    { name: 'Twilio Inc.', priority: 'Medium', emissions: '3.28%', spend: '$25,149,543', rank: 22, industry: 'Software...', targets: '', status: 'medium' },
    { name: 'Yodlee, Inc.', priority: 'Medium', emissions: '2.61%', spend: '$130,594,148', rank: 12, industry: 'Software...', targets: 'Scope 1 &...', status: 'medium' },
    { name: 'Apple Inc.', priority: 'Medium', emissions: '2.34%', spend: '$233,043,801', rank: 14, industry: 'Wireless c...', targets: 'Scope 1 &...', status: 'medium' },
    { name: 'The Vanguard Group, Inc.', priority: 'Medium', emissions: '2.25%', spend: '$42,439,084', rank: 15, industry: 'Open-End...', targets: '', status: 'medium' },
    { name: 'Checkr, Inc.', priority: 'Medium', emissions: '2.07%', spend: '$98,641,320', rank: 16, industry: 'Software...', targets: '', status: 'medium' },
    { name: 'Kaiser Permanente Inc.', priority: 'Medium', emissions: '1.72%', spend: '$93,411,388', rank: 18, industry: 'General M...', targets: 'Committe...', status: 'medium' },
    { name: 'Guardian Media Group plc', priority: 'Medium', emissions: '1.41%', spend: '$22,726,483', rank: 20, industry: 'Newspap...', targets: 'Committe...', status: 'medium' },
    { name: 'TELUS Corporation', priority: 'Low', emissions: '0.00%', spend: '$153,709,700', rank: 85, industry: 'Telecomm...', targets: 'Scope 1 &...', status: 'low' },
    { name: 'Workday, Inc.', priority: 'Low', emissions: '0.00%', spend: '$12,718,210', rank: 85, industry: 'Software...', targets: 'Scope 3 ta...', status: 'low' },
    { name: 'Deloitte', priority: 'Low', emissions: '0.00%', spend: '$93,135,498', rank: 85, industry: 'Profession...', targets: 'Scope 1 &...', status: 'low' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supply chain</h1>
          <div className="flex items-center space-x-4 mt-2">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-1 text-sm font-medium">
              Overview
            </button>
            <button className="text-gray-600 hover:text-gray-900 text-sm">
              Tasks
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All activity</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Jan - Dec 2022</option>
          </select>
          <button className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <span>Support</span>
          </button>
          <button className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <span>Program customization</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Assign tasks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Suppliers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold">Suppliers (97)</h2>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <span>Sandbox</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>Supplier</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>Priority</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>% of your emissions</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>Emissive spend</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>Rank by...</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>Industries</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>Targets</span>
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {suppliers.map((supplier, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium text-gray-900">{supplier.name}</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(supplier.priority)}`}>
                          {supplier.priority}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </span>
                      </td>
                      <td className="p-4 text-gray-900">{supplier.emissions}</td>
                      <td className="p-4 text-gray-900">{supplier.spend}</td>
                      <td className="p-4 text-gray-900">{supplier.rank}</td>
                      <td className="p-4 text-gray-600 text-sm">{supplier.industry}</td>
                      <td className="p-4 text-blue-600 text-sm">{supplier.targets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Supply Chain Metrics */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply chain metrics</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Total supply chain emissions</span>
                  <span className="text-sm font-medium">420,020 tCO₂e</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Tasks created</span>
                  <span className="text-sm font-medium">53 tasks</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Tasks submitted</span>
                  <span className="text-sm font-medium">5 tasks</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Tasks approved</span>
                  <span className="text-sm font-medium">6 tasks</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Suppliers approved by SBTi</span>
                  <span className="text-sm font-medium">36 suppliers</span>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700">
              Calculate forecast
            </button>
          </div>

          {/* Supplier Engagement Progress */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Supplier engagement progress</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SBTi</span>
                <div className="w-24 h-2 bg-green-200 rounded-full">
                  <div className="w-full h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total engagement</span>
                <div className="w-24 h-2 bg-green-200 rounded-full">
                  <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disclose targets</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/3 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Understanding your...</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/4 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disclose reduction...</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div className="w-1/5 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Share your emis...</span>
                <div className="w-24 h-2 bg-green-200 rounded-full">
                  <div className="w-full h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* SBTi Status */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">SBTi status</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="75, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">75%</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Validated by SBTi</span>
                <span className="text-gray-900 font-medium">36.8% (154,440 tCO₂e)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                <span className="text-gray-600">Committed</span>
                <span className="text-gray-900 font-medium">1.5% (6,415 tCO₂e)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-600">Not started</span>
                <span className="text-gray-900 font-medium">61.7% (259,164 tCO₂e)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChain;