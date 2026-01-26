import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, BarChart3, Settings, Shield, Download } from 'lucide-react';

const AdminPanel = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Amit Sharma', email: 'amit@example.com', alerts: 12, lastActive: '2 hours ago', status: 'active', role: 'user' },
        { id: 2, name: 'Priya Patel', email: 'priya@example.com', alerts: 8, lastActive: '1 day ago', status: 'active', role: 'user' },
        { id: 3, name: 'Rajesh Kumar', email: 'rajesh@example.com', alerts: 25, lastActive: 'Just now', status: 'active', role: 'admin' },
        { id: 4, name: 'Sneha Singh', email: 'sneha@example.com', alerts: 3, lastActive: '3 days ago', status: 'inactive', role: 'user' },
        { id: 5, name: 'Vikram Mehta', email: 'vikram@example.com', alerts: 18, lastActive: '5 hours ago', status: 'active', role: 'user' },
        { id: 6, name: 'Anjali Reddy', email: 'anjali@example.com', alerts: 0, lastActive: '1 week ago', status: 'inactive', role: 'user' },
      ]);
      
      setStats({
        totalUsers: 156,
        activeUsers: 128,
        totalAlerts: 2456,
        avgAQI: 215,
        peakAQI: 356,
        alertRate: 78
      });
      
      setLoading(false);
    }, 1000);
  };

  const userGrowthData = [
    { month: 'Jan', users: 120, alerts: 1560 },
    { month: 'Feb', users: 132, alerts: 1890 },
    { month: 'Mar', users: 141, alerts: 2150 },
    { month: 'Apr', users: 148, alerts: 2300 },
    { month: 'May', users: 152, alerts: 2400 },
    { month: 'Jun', users: 156, alerts: 2456 },
  ];

  const alertDistributionData = [
    { name: 'AQI Alerts', value: 45, color: '#ff6b6b' },
    { name: 'PM2.5 Alerts', value: 30, color: '#4ecdc4' },
    { name: 'PM10 Alerts', value: 15, color: '#45b7d1' },
    { name: 'NO₂ Alerts', value: 7, color: '#96ceb4' },
    { name: 'Other', value: 3, color: '#ffeaa7' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage users, monitor system health, and analyze platform data
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
            { title: 'Total Users', value: stats.totalUsers, icon: <Users className="w-8 h-8" />, color: 'text-blue-500' },
            { title: 'Active Users', value: stats.activeUsers, icon: <Activity className="w-8 h-8" />, color: 'text-green-500' },
            { title: 'Total Alerts', value: stats.totalAlerts, icon: <BarChart3 className="w-8 h-8" />, color: 'text-red-500' },
            { title: 'Alert Success Rate', value: `${stats.alertRate}%`, icon: <Settings className="w-8 h-8" />, color: 'text-purple-500' },
            ].map((stat, index) => (
            <div key={index} className={`p-6 rounded-2xl border ${
                theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
                <div className="flex items-center justify-between">
                <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-gray-500">{stat.title}</div>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                    {stat.icon}
                </div>
                </div>
            </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">User Growth & Alerts</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937'
                  }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alerts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Distribution */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Alert Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {alertDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Management</h3>
            <div className="flex space-x-3">
              <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Export CSV
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Add User
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">User</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Alerts</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Last Active</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Role</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold">{user.alerts}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-500">{user.lastActive}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="text-lg">✏️</span>
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="text-lg">👁️</span>
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">API Status</h3>
          <div className="space-y-3">
            {[
              { name: 'AQI Data API', status: 'operational', latency: '45ms' },
              { name: 'Alert Service', status: 'operational', latency: '23ms' },
              { name: 'User Service', status: 'operational', latency: '67ms' },
              { name: 'Email Service', status: 'degraded', latency: '215ms' },
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.latency}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  service.status === 'operational' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Send Broadcast Alert
            </button>
            <button className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Generate Report
            </button>
            <button className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Backup Database
            </button>
            <button className="w-full px-4 py-3 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Emergency Mode
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              { action: 'New user registered', time: '5 mins ago', user: 'amit@example.com' },
              { action: 'Alert triggered', time: '12 mins ago', user: 'West Delhi AQI' },
              { action: 'API key rotated', time: '2 hours ago', user: 'System' },
              { action: 'Database backup', time: '6 hours ago', user: 'System' },
              { action: 'Email sent', time: '1 day ago', user: '245 users' },
            ].map((activity, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="font-medium">{activity.action}</div>
                <div className="text-sm text-gray-500">
                  {activity.user} • {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;