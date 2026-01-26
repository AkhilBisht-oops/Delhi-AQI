import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AQIWidget = ({ data, loading }) => {
  const { theme } = useTheme();

  const getAQICategory = (aqi) => {
    if (!aqi) return { level: 'Loading...', color: '#9ca3af' };
    if (aqi <= 50) return { level: 'Good', color: '#009966' };
    if (aqi <= 100) return { level: 'Moderate', color: '#ffde33' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#ff9933' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#cc0033' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#660099' };
    return { level: 'Hazardous', color: '#7e0023' };
  };

  const category = getAQICategory(data?.overallAQI);

  return (
    <div className={`p-6 rounded-2xl border ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Main AQI Display */}
        <div className="text-center lg:text-left mb-6 lg:mb-0">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current AQI</div>
          <div className="flex items-baseline">
            <div 
              className="text-6xl font-bold"
              style={{ color: category.color }}
            >
              {loading ? '--' : data?.overallAQI}
            </div>
            <div 
              className="ml-3 text-xl font-semibold"
              style={{ color: category.color }}
            >
              {category.level}
            </div>
          </div>
          <div className="mt-2 text-gray-500 dark:text-gray-400">
            Primary Pollutant: {data?.primaryPollutant || 'PM2.5'}
          </div>
        </div>

        {/* AQI Scale */}
        <div className="w-full lg:w-2/3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300</span>
              <span>500</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="flex-1 bg-green-500"></div>
                <div className="flex-1 bg-yellow-400"></div>
                <div className="flex-1 bg-orange-500"></div>
                <div className="flex-1 bg-red-600"></div>
                <div className="flex-1 bg-purple-700"></div>
                <div className="flex-1 bg-red-900"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Good</span>
              <span>Moderate</span>
              <span>Unhealthy<br/>Sensitive</span>
              <span>Unhealthy</span>
              <span>Very<br/>Unhealthy</span>
              <span>Hazardous</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIWidget;