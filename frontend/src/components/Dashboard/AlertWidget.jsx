import React from 'react';
import { Link } from 'react-router-dom';

const AlertWidget = () => {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Active Alert</h3>
          <div className="text-xl font-bold">AQI: 245</div>
          <div className="text-sm opacity-90">Very Unhealthy</div>
        </div>
        <div className="text-3xl animate-pulse">🚨</div>
      </div>
      
      <p className="mb-4 text-sm">
        Air quality is very unhealthy. Sensitive groups should avoid outdoor activities.
      </p>
      
      <Link 
        to="/alerts"
        className="inline-block w-full text-center py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default AlertWidget;