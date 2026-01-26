import React from 'react';

const LiveMap = () => {
  return (
    <div className="relative h-64 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold mb-2">Interactive Heatmap</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Showing real-time pollution levels
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;