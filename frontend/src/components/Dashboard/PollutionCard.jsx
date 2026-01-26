import React from 'react';

const PollutionCard = ({ pollutant, value, unit, level, color }) => {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{pollutant}</div>
          <div className="text-2xl font-bold mt-1">{value || '--'}{unit}</div>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${color} text-white`}>
          {level}
        </span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {pollutant === 'PM2.5' ? 'Fine particulate matter' :
         pollutant === 'PM10' ? 'Coarse particulate matter' :
         'Nitrogen dioxide'}
      </div>
    </div>
  );
};

export default PollutionCard;