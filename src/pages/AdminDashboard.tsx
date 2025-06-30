import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const adminStats = [
    { label: 'Total Users', value: '247', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Sessions', value: '89', icon: Activity, color: 'bg-green-500' },
    { label: 'Data Sources', value: '12', icon: Database, color: 'bg-purple-500' },
    { label: 'System Health', value: '98%', icon: Shield, color: 'bg-emerald-500' },
  ];

  const recentActivity = [
    { user: 'Chelsea Kaufman', action: 'Uploaded supply chain data', time: '2 minutes ago', status: 'success' },
    { user: 'Afraz Muneer', action: 'Generated ESG report', time: '15 minutes ago', status: 'success' },
    { user: 'System', action: 'Data backup completed', time: '1 hour ago', status: 'success' },
    { user: 'Emad Qureshi', action: 'Failed login attempt', time: '2 hours ago', status: 'warning' },
    { user: 'System', action: 'Security scan completed', time: '3 hours ago', status: 'success' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'High CPU usage detected on server 2', time: '5 minutes ago' },
    { type: 'info', message: 'Scheduled maintenance in 2 days', time: '1 hour ago' },
    { type: 'success', message: 'All security patches applied successfully', time: '6 hours ago' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}. Here's your system overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">24h</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">7d</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">30d</button>
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-gray-600">System performance metrics</p>
              <p className="text-sm text-gray-500">CPU, Memory, Network usage charts</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">Manage Users</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">System Settings</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Database Backup</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">Generate Reports</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-4">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                alert.type === 'success' ? 'bg-green-50 border-green-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start space-x-2">
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />}
                  {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
                  {alert.type === 'info' && <BarChart3 className="w-4 h-4 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;