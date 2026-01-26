import React from 'react';

const StatsCard = ({ title, value, unit, change, trend, icon, description }) => {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
          <div className="text-2xl font-bold mt-1">
            {value} {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
          {description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</div>
          )}
          {change && (
            <div className={`text-sm mt-1 font-medium ${
              trend === 'up' ? 'text-red-600' : 'text-green-600'
            }`}>
              {change} {trend === 'up' ? '↗' : '↘'}
            </div>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;