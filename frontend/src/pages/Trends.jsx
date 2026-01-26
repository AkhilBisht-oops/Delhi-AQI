import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const Trends = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [loading, setLoading] = useState(false);

  // Mock data for trends
  const weeklyData = [
    { day: 'Mon', aqi: 198, pm25: 145, pm10: 210, no2: 38 },
    { day: 'Tue', aqi: 215, pm25: 165, pm10: 245, no2: 45 },
    { day: 'Wed', aqi: 245, pm25: 185, pm10: 280, no2: 52 },
    { day: 'Thu', aqi: 287, pm25: 215, pm10: 310, no2: 58 },
    { day: 'Fri', aqi: 312, pm25: 245, pm10: 340, no2: 65 },
    { day: 'Sat', aqi: 265, pm25: 195, pm10: 290, no2: 48 },
    { day: 'Sun', aqi: 230, pm25: 175, pm10: 265, no2: 42 },
  ];

  const monthlyData = [
    { month: 'Jan', avg: 215, min: 180, max: 280 },
    { month: 'Feb', avg: 198, min: 165, max: 245 },
    { month: 'Mar', avg: 245, min: 195, max: 312 },
    { month: 'Apr', avg: 287, min: 230, max: 345 },
    { month: 'May', avg: 312, min: 265, max: 380 },
    { month: 'Jun', avg: 298, min: 245, max: 365 },
    { month: 'Jul', avg: 265, min: 215, max: 320 },
    { month: 'Aug', avg: 230, min: 185, max: 295 },
    { month: 'Sep', avg: 245, min: 195, max: 310 },
    { month: 'Oct', avg: 280, min: 230, max: 335 },
    { month: 'Nov', avg: 310, min: 265, max: 370 },
    { month: 'Dec', avg: 295, min: 245, max: 355 },
  ];

  const hourlyData = [
    { hour: '00:00', aqi: 245, pm25: 185 },
    { hour: '04:00', aqi: 265, pm25: 205 },
    { hour: '08:00', aqi: 312, pm25: 245 },
    { hour: '12:00', aqi: 298, pm25: 230 },
    { hour: '16:00', aqi: 265, pm25: 195 },
    { hour: '20:00', aqi: 230, pm25: 175 },
  ];

  const getChartData = () => {
    switch(timeRange) {
      case 'day': return hourlyData;
      case 'week': return weeklyData;
      case 'month': return monthlyData;
      default: return weeklyData;
    }
  };

  const getChartConfig = () => {
    const pollutantColors = {
      aqi: theme === 'dark' ? '#60a5fa' : '#3b82f6',
      pm25: theme === 'dark' ? '#f87171' : '#ef4444',
      pm10: theme === 'dark' ? '#fb923c' : '#f97316',
      no2: theme === 'dark' ? '#a78bfa' : '#8b5cf6',
    };

    return {
      color: pollutantColors[selectedPollutant] || pollutantColors.aqi,
      dataKey: selectedPollutant,
      name: selectedPollutant.toUpperCase(),
    };
  };

  const chartConfig = getChartConfig();
  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <TrendingUp className="w-8 h-8 mr-3" />
                Pollution Trends
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Analyze historical data and forecast pollution patterns
            </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {['day', 'week', 'month'].map((range) => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-colors flex items-center ${
                    timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    {range}
                </button>
            ))}
          </div>

          {/* Pollutant Selector */}
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className={`px-4 py-2 rounded-lg border flex items-center ${
                theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            >
            <BarChart3 className="w-4 h-4 mr-2" />
            <option value="aqi">AQI</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="no2">NO₂</option>
        </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Trend Chart */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">
            {selectedPollutant.toUpperCase()} Trend - Last {timeRange}
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey={timeRange === 'day' ? 'hour' : timeRange === 'week' ? 'day' : 'month'}
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                  label={{ 
                    value: selectedPollutant === 'aqi' ? 'AQI' : 'µg/m³', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [value, selectedPollutant.toUpperCase()]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={chartConfig.dataKey} 
                  stroke={chartConfig.color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name={chartConfig.name}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Pollutant Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="day"
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                <YAxis 
                  stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="pm25" 
                  fill="#ef4444" 
                  name="PM2.5"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="pm10" 
                  fill="#f97316" 
                  name="PM10"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="no2" 
                  fill="#8b5cf6" 
                  name="NO₂"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats and Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Card */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Average {selectedPollutant.toUpperCase()}</span>
                <span className="font-bold">
                  {Math.round(chartData.reduce((acc, curr) => acc + curr[selectedPollutant], 0) / chartData.length)}
                  {selectedPollutant === 'aqi' ? ' AQI' : ' µg/m³'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Peak Value</span>
                <span className="font-bold">
                  {Math.max(...chartData.map(d => d[selectedPollutant]))}
                  {selectedPollutant === 'aqi' ? ' AQI' : ' µg/m³'}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Trend</span>
                <span className="font-bold text-red-600">+12% ↗</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: '45%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Card */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
          <div className="space-y-3">
            {[
              { day: 'Today', aqi: 215, trend: 'same', icon: '🌫️' },
              { day: 'Tomorrow', aqi: 198, trend: 'down', icon: '🌥️' },
              { day: 'Wed', aqi: 185, trend: 'down', icon: '⛅' },
              { day: 'Thu', aqi: 210, trend: 'up', icon: '🌫️' },
              { day: 'Fri', aqi: 225, trend: 'up', icon: '🌫️' },
              { day: 'Sat', aqi: 195, trend: 'down', icon: '🌤️' },
              { day: 'Sun', aqi: 180, trend: 'down', icon: '🌤️' },
            ].map((forecast, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{forecast.icon}</span>
                  <span className="font-medium">{forecast.day}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold">{forecast.aqi} AQI</span>
                  <span className={`text-sm ${
                    forecast.trend === 'up' ? 'text-red-600' :
                    forecast.trend === 'down' ? 'text-green-600' :
                    'text-gray-500'
                  }`}>
                    {forecast.trend === 'up' ? '↗' : 
                     forecast.trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Card */}
        <div className={`p-6 rounded-2xl border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Trend Insights</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="font-medium text-blue-800 dark:text-blue-300">Peak Hours</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Highest pollution typically occurs between 8 AM - 12 PM
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="font-medium text-green-800 dark:text-green-300">Improving Trend</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Weekends show 15% better air quality on average
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="font-medium text-red-800 dark:text-red-300">Warning</div>
              <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                Winter months show 40% higher PM2.5 levels
              </div>
            </div>

            <button className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Download Trend Report →
            </button>
          </div>
        </div>
      </div>

      {/* District Comparison */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className="text-lg font-semibold mb-6">District-wise Trend Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="day"
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <YAxis 
                stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                  borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="aqi" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Central Delhi"
              />
              <Area 
                type="monotone" 
                dataKey="pm25" 
                stackId="1"
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.6}
                name="West Delhi"
              />
              <Area 
                type="monotone" 
                dataKey="pm10" 
                stackId="1"
                stroke="#f97316" 
                fill="#f97316" 
                fillOpacity={0.6}
                name="South Delhi"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Trends;