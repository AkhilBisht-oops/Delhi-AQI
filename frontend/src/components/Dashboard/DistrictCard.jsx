import React from 'react';

const DistrictCard = ({ district }) => {
  const getStatusColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (aqi <= 150) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    if (aqi <= 200) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (aqi <= 300) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    return 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300';
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{district.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            PM2.5: {district.pm25} µg/m³
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="font-bold">{district.aqi}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(district.aqi)}`}>
              {district.status}
            </div>
          </div>
          <div className="text-xl">
            {district.trend === 'up' ? '↗️' : 
             district.trend === 'down' ? '↘️' : '➡️'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictCard;