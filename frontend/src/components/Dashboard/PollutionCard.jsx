import React from 'react';

const PollutionCard = ({ pollutant, value, unit, level, color }) => {
  const getGradient = () => {
    if (color?.includes('red')) return 'from-red-500/20 to-red-900/10';
    if (color?.includes('orange')) return 'from-orange-500/20 to-orange-900/10';
    if (color?.includes('yellow')) return 'from-yellow-500/20 to-yellow-900/10';
    if (color?.includes('green')) return 'from-green-500/20 to-green-900/10';
    return 'from-blue-500/20 to-blue-900/10';
  };

  const getAccentColor = () => {
    if (color?.includes('red')) return '#ef4444';
    if (color?.includes('orange')) return '#f97316';
    if (color?.includes('yellow')) return '#eab308';
    if (color?.includes('green')) return '#22c55e';
    return '#3b82f6';
  };

  const accent = getAccentColor();

  return (
    <div className="p-5 perspective-card">
      <div className="perspective-card-inner">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-sm text-gray-400 font-medium">{pollutant}</div>
            <div className="text-3xl font-black mt-1 text-white">
              {value || '--'}
              <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
            </div>
          </div>
          <span 
            className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ 
              backgroundColor: `${accent}20`,
              color: accent,
              boxShadow: `0 0 12px ${accent}15`
            }}
          >
            {level}
          </span>
        </div>
        
        {/* Animated bar */}
        <div className="h-1.5 rounded-full bg-gray-800/50 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min((value || 0) / 3, 100)}%`,
              background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
              boxShadow: `0 0 8px ${accent}40`
            }}
          />
        </div>
        
        <div className="text-xs text-gray-500 mt-3">
          {pollutant === 'PM2.5' ? 'Fine particulate matter' :
           pollutant === 'PM10' ? 'Coarse particulate matter' :
           'Nitrogen dioxide'}
        </div>
      </div>
    </div>
  );
};

export default PollutionCard;