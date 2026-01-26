import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import AQIWidget from '../components/Dashboard/AQIWidget';
import PollutionCard from '../components/Dashboard/PollutionCard';
import WeatherWidget from '../components/Dashboard/WeatherWidget';
import AlertWidget from '../components/Dashboard/AlertWidget';
import DistrictCard from '../components/Dashboard/DistrictCard';
import LiveMap from '../components/Dashboard/LiveMap';
import StatsCard from '../components/Dashboard/StatsCard';

// Import icons
import { 
  CloudSun, 
  Gauge, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Cloud
} from 'lucide-react';

const Dashboard = () => {
  const { theme } = useTheme();
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  const delhiDistricts = [
    { name: 'Central Delhi', aqi: 245, pm25: 185, status: 'Very Unhealthy', trend: 'up' },
    { name: 'New Delhi', aqi: 198, pm25: 165, status: 'Unhealthy', trend: 'down' },
    { name: 'South Delhi', aqi: 176, pm25: 145, status: 'Unhealthy', trend: 'stable' },
    { name: 'West Delhi', aqi: 312, pm25: 245, status: 'Hazardous', trend: 'up' },
    { name: 'North Delhi', aqi: 154, pm25: 125, status: 'Unhealthy for Sensitive', trend: 'down' },
    { name: 'East Delhi', aqi: 287, pm25: 215, status: 'Very Unhealthy', trend: 'up' },
  ];

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveData = async () => {
    try {
      setTimeout(() => {
        setLiveData({
          overallAQI: 215,
          pm25: 165,
          pm10: 245,
          no2: 45,
          so2: 28,
          o3: 65,
          co: 2.8,
          temperature: 28,
          humidity: 45,
          windSpeed: 12,
          windDirection: 'NW',
          pressure: 1013,
          lastUpdated: new Date().toLocaleTimeString(),
          primaryPollutant: 'PM2.5'
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* SINGLE MAIN HEADER - Keep only this one */}
        <header className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <CloudSun className="w-8 h-8 mr-3" />
                Delhi Air Quality Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Real-time monitoring • Live updates • Comprehensive analysis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse flex items-center">
                <Gauge className="w-4 h-4 mr-2" />
                LIVE
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated: {liveData?.lastUpdated || 'Loading...'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main AQI Widget - WITHOUT DUPLICATE TITLE */}
            <div className={`rounded-2xl overflow-hidden border transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Current Air Quality Index</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Real-time AQI measurement
                </p>
              </div>
              <AQIWidget data={liveData} loading={loading} />
            </div>

            {/* Pollution Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">PM2.5</h3>
                </div>
                <PollutionCard 
                  pollutant="PM2.5" 
                  value={liveData?.pm25} 
                  unit="µg/m³" 
                  level="Very High" 
                  color="from-red-500 to-orange-500"
                />
              </div>
              <div className={`rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">PM10</h3>
                </div>
                <PollutionCard 
                  pollutant="PM10" 
                  value={liveData?.pm10} 
                  unit="µg/m³" 
                  level="High" 
                  color="from-orange-500 to-yellow-500"
                />
              </div>
              <div className={`rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium">NO₂</h3>
                </div>
                <PollutionCard 
                  pollutant="NO₂" 
                  value={liveData?.no2} 
                  unit="ppb" 
                  level="Moderate" 
                  color="from-yellow-500 to-green-500"
                />
              </div>
            </div>

            {/* Live Map */}
            <div className={`rounded-2xl overflow-hidden border transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Delhi Pollution Heatmap</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Real-time pollution levels across districts
                </p>
              </div>
              <LiveMap />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <div className={`rounded-2xl overflow-hidden border transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Weather Conditions</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Current atmospheric data
                </p>
              </div>
              <WeatherWidget data={liveData} />
            </div>

            {/* Alert Widget */}
            <div className={`rounded-2xl overflow-hidden border transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Active Alerts</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Health advisories and warnings
                </p>
              </div>
              <AlertWidget />
            </div>

            {/* District List */}
            <div className={`rounded-2xl overflow-hidden border transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">District-wise AQI</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Current status across Delhi
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                {delhiDistricts.map((district, index) => (
                  <DistrictCard key={index} district={district} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`rounded-xl border transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <StatsCard 
              title="24h Average" 
              value="198" 
              unit="AQI" 
              change="-12%" 
              trend="down"
              icon={<TrendingDown className="w-8 h-8 text-green-500" />}
            />
          </div>
          <div className={`rounded-xl border transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <StatsCard 
              title="Peak Today" 
              value="312" 
              unit="AQI" 
              change="+8%" 
              trend="up"
              icon={<TrendingUp className="w-8 h-8 text-red-500" />}
            />
          </div>
          <div className={`rounded-xl border transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <StatsCard 
              title="Health Impact" 
              value="High" 
              description="Sensitive groups avoid outdoor"
              icon={<AlertTriangle className="w-8 h-8 text-orange-500" />}
            />
          </div>
          <div className={`rounded-xl border transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <StatsCard 
              title="Forecast" 
              value="Improving" 
              description="Better air expected tomorrow"
              icon={<Cloud className="w-8 h-8 text-blue-500" />}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className={`rounded-xl border p-4 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <p>⚠️ Health Advisory: When AQI exceeds 200, sensitive groups should avoid prolonged outdoor exposure.</p>
          <p className="mt-1">Data updates every minute • Last checked: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;