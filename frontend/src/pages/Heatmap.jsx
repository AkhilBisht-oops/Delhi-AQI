import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Map, Filter, AlertCircle } from 'lucide-react';

const Heatmap = () => {
  const { theme } = useTheme();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');

  const delhiDistricts = [
    { 
      id: 1, 
      name: 'Central Delhi', 
      lat: 28.633, 
      lng: 77.220, 
      aqi: 245, 
      pm25: 185, 
      pm10: 280, 
      no2: 52,
      color: '#7e0023',
      position: { top: '45%', left: '50%' }
    },
    { 
      id: 2, 
      name: 'New Delhi', 
      lat: 28.6139, 
      lng: 77.2090, 
      aqi: 198, 
      pm25: 165, 
      pm10: 245, 
      no2: 45,
      color: '#cc0033',
      position: { top: '48%', left: '52%' }
    },
    { 
      id: 3, 
      name: 'South Delhi', 
      lat: 28.524, 
      lng: 77.222, 
      aqi: 176, 
      pm25: 145, 
      pm10: 210, 
      no2: 38,
      color: '#ff9933',
      position: { top: '60%', left: '50%' }
    },
    { 
      id: 4, 
      name: 'West Delhi', 
      lat: 28.678, 
      lng: 77.072, 
      aqi: 312, 
      pm25: 245, 
      pm10: 340, 
      no2: 65,
      color: '#7e0023',
      position: { top: '40%', left: '40%' }
    },
    { 
      id: 5, 
      name: 'North Delhi', 
      lat: 28.704, 
      lng: 77.102, 
      aqi: 154, 
      pm25: 125, 
      pm10: 195, 
      no2: 32,
      color: '#ff9933',
      position: { top: '30%', left: '48%' }
    },
    { 
      id: 6, 
      name: 'East Delhi', 
      lat: 28.625, 
      lng: 77.315, 
      aqi: 287, 
      pm25: 215, 
      pm10: 310, 
      no2: 58,
      color: '#660099',
      position: { top: '50%', left: '60%' }
    },
    { 
      id: 7, 
      name: 'Dwarka', 
      lat: 28.584, 
      lng: 77.049, 
      aqi: 132, 
      pm25: 110, 
      pm10: 180, 
      no2: 28,
      color: '#ffde33',
      position: { top: '55%', left: '38%' }
    },
    { 
      id: 8, 
      name: 'Rohini', 
      lat: 28.743, 
      lng: 77.081, 
      aqi: 198, 
      pm25: 165, 
      pm10: 245, 
      no2: 45,
      color: '#cc0033',
      position: { top: '25%', left: '45%' }
    },
  ];

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getPollutantValue = (district, pollutant) => {
    switch(pollutant) {
      case 'aqi': return district.aqi;
      case 'pm25': return district.pm25;
      case 'pm10': return district.pm10;
      case 'no2': return district.no2;
      default: return district.aqi;
    }
  };

  const getPollutantColor = (value, pollutant) => {
    if (pollutant === 'aqi') {
      if (value <= 50) return '#009966';
      if (value <= 100) return '#ffde33';
      if (value <= 150) return '#ff9933';
      if (value <= 200) return '#cc0033';
      if (value <= 300) return '#660099';
      return '#7e0023';
    } else if (pollutant === 'pm25') {
      if (value <= 12) return '#009966';
      if (value <= 35) return '#ffde33';
      if (value <= 55) return '#ff9933';
      if (value <= 150) return '#cc0033';
      if (value <= 250) return '#660099';
      return '#7e0023';
    } else {
      // Simple gradient for other pollutants
      const maxValue = pollutant === 'pm10' ? 400 : 100;
      const intensity = Math.min(value / maxValue, 1);
      const r = Math.floor(255 * intensity);
      const g = Math.floor(255 * (1 - intensity));
      return `rgb(${r}, ${g}, 0)`;
    }
  };

  const getPollutantUnit = (pollutant) => {
    switch(pollutant) {
      case 'aqi': return 'AQI';
      case 'pm25':
      case 'pm10': return 'µg/m³';
      case 'no2': return 'ppb';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Map className="w-8 h-8 mr-3" />
                Delhi Pollution Heatmap
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Interactive visualization of pollution levels across Delhi districts
            </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-red-600"></div>
            <span className="text-sm">Low → High Pollution</span>
          </div>
          <select 
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className={`px-4 py-2 rounded-lg border flex items-center ${
                theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            >
                <Filter className="w-4 h-4 mr-2" />
                <option value="aqi">AQI</option>
                <option value="pm25">PM2.5</option>
                <option value="pm10">PM10</option>
                <option value="no2">NO₂</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Interactive Map */}
        <div className="lg:col-span-3">
          <div className={`rounded-2xl overflow-hidden border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Delhi Pollution Map</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Click on any district for detailed information
              </p>
            </div>
            
            {/* Interactive Map Visualization */}
            <div className="relative p-6 h-[600px] bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
              {/* Delhi Outline Map */}
              <div className="absolute inset-6 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {/* River Yamuna */}
                <div className="absolute left-1/4 top-1/4 bottom-1/4 w-2 bg-blue-300 dark:bg-blue-800 rounded-full"></div>
                
                {/* District Markers */}
                {delhiDistricts.map(district => {
                  const value = getPollutantValue(district, selectedPollutant);
                  const color = getPollutantColor(value, selectedPollutant);
                  const size = 20 + (value / 500) * 40; // Scale marker size based on value
                  
                  return (
                    <button
                      key={district.id}
                      onClick={() => setSelectedDistrict(district)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white dark:border-gray-900 shadow-lg transition-all hover:scale-110 ${
                        selectedDistrict?.id === district.id ? 'ring-4 ring-blue-400 ring-opacity-50 scale-110' : ''
                      }`}
                      style={{
                        top: district.position.top,
                        left: district.position.left,
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: color,
                      }}
                      title={`${district.name}: ${value} ${getPollutantUnit(selectedPollutant)}`}
                    >
                      <span className="sr-only">{district.name}</span>
                    </button>
                  );
                })}
                
                {/* Labels */}
                {delhiDistricts.map(district => (
                  <div
                    key={`label-${district.id}`}
                    className="absolute text-xs font-medium text-gray-700 dark:text-gray-300"
                    style={{
                      top: `calc(${district.position.top} + 15px)`,
                      left: district.position.left,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {district.name}
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-lg backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'bg-gray-800/80 border border-gray-700' 
                  : 'bg-white/80 border border-gray-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-medium">Pollution Level: </span>
                    <span className={`font-bold ${
                      selectedDistrict ? '' : 'text-gray-500'
                    }`}>
                      {selectedDistrict 
                        ? `${getPollutantValue(selectedDistrict, selectedPollutant)} ${getPollutantUnit(selectedPollutant)}`
                        : 'Select a district'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm">Low</span>
                    <div className="w-12 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 rounded"></div>
                    <div className="w-4 h-4 rounded bg-red-600"></div>
                    <span className="text-sm">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Selected District Info */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-bold text-lg mb-4">
              {selectedDistrict ? selectedDistrict.name : 'Select a District'}
            </h3>
            
            {selectedDistrict ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">AQI</div>
                    <div className="text-2xl font-bold" style={{ color: getPollutantColor(selectedDistrict.aqi, 'aqi') }}>
                      {selectedDistrict.aqi}
                    </div>
                    <div className="text-sm">{getAQILevel(selectedDistrict.aqi)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">{selectedPollutant.toUpperCase()}</div>
                    <div className="text-2xl font-bold">
                      {getPollutantValue(selectedDistrict, selectedPollutant)}
                    </div>
                    <div className="text-sm">{getPollutantUnit(selectedPollutant)}</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">All Pollutants</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">PM2.5</span>
                      <span className="font-medium">{selectedDistrict.pm25} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">PM10</span>
                      <span className="font-medium">{selectedDistrict.pm10} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">NO₂</span>
                      <span className="font-medium">{selectedDistrict.no2} ppb</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Set Alert for this Area
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📍</div>
                <p className="text-gray-500 dark:text-gray-400">
                  Click on any district on the map to view detailed information
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-bold text-lg mb-4">AQI Color Legend</h3>
            <div className="space-y-3">
              {[
                { range: '0-50', label: 'Good', color: '#009966' },
                { range: '51-100', label: 'Moderate', color: '#ffde33' },
                { range: '101-150', label: 'Unhealthy for Sensitive', color: '#ff9933' },
                { range: '151-200', label: 'Unhealthy', color: '#cc0033' },
                { range: '201-300', label: 'Very Unhealthy', color: '#660099' },
                { range: '301+', label: 'Hazardous', color: '#7e0023' },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className={`p-6 rounded-2xl border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-bold text-lg mb-4">Pollution Statistics</h3>
            <div className="space-y-4">
              {[
                { label: 'Most Polluted', value: 'West Delhi', aqi: 312, color: '#7e0023' },
                { label: 'Least Polluted', value: 'Dwarka', aqi: 132, color: '#ffde33' },
                { label: 'City Average', value: 'All Delhi', aqi: 215, color: '#cc0033' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{stat.label}</span>
                    <span>AQI: {stat.aqi}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${(stat.aqi / 500) * 100}%`,
                        backgroundColor: stat.color
                      }}
                    ></div>
                  </div>
                  <div className="text-sm mt-1 font-medium">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">District-wise Pollution Data</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Real-time pollution levels across all Delhi districts
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
              <tr>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">District</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">AQI</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">PM2.5</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">PM10</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">NO₂</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-6 text-gray-500 dark:text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {delhiDistricts.map(district => (
                <tr 
                  key={district.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer ${
                    selectedDistrict?.id === district.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedDistrict(district)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: getPollutantColor(district.aqi, 'aqi') }}
                      ></div>
                      <span className="font-medium">{district.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold">{district.aqi}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{district.pm25} µg/m³</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{district.pm10} µg/m³</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{district.no2} ppb</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      district.aqi <= 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      district.aqi <= 100 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      district.aqi <= 150 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                      district.aqi <= 200 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      district.aqi <= 300 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                      'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-300'
                    }`}>
                      {getAQILevel(district.aqi)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDistrict(district);
                      }}
                      className="px-3 py-1 text-sm rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;