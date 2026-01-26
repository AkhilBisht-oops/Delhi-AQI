import React from 'react';
import { Cloud, Wind } from 'lucide-react';

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg' },
    lg: { container: 'w-12 h-12', icon: 'w-8 h-8', text: 'text-xl' },
  };

  const { container, icon, text } = sizes[size];

  return (
    <div className="flex items-center space-x-3">
      <div className={`${container} rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative`}>
        <Cloud className={`${icon} text-white`} />
        <Wind className={`${icon} text-white absolute -bottom-1 -right-1`} />
      </div>
      {showText && (
        <div>
          <div className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${text}`}>
            AQI Pro
          </div>
          <div className="text-xs text-gray-500">Air Quality Intelligence</div>
        </div>
      )}
    </div>
  );
};

export default Logo;