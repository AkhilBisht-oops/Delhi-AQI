import React from 'react';
import { Thermometer, Droplets, Wind, Cloud } from 'lucide-react';

const WeatherWidget = ({ data }) => {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1 flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Weather
          </h3>
          <div className="text-3xl font-bold flex items-center">
            <Thermometer className="w-8 h-8 mr-2" />
            {data?.temperature || '--'}°C
          </div>
        </div>
        <div className="text-4xl">🌤️</div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <Droplets className="w-4 h-4 mr-2" />
            Humidity
          </span>
          <span className="font-semibold">{data?.humidity || '--'}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            <Wind className="w-4 h-4 mr-2" />
            Wind Speed
          </span>
          <span className="font-semibold">{data?.windSpeed || '--'} m/s</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Pressure</span>
          <span className="font-semibold">{data?.pressure || '1013'} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;