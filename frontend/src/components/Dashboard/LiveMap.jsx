import React from 'react';
import { MapPin, Globe } from 'lucide-react';

const LiveMap = () => {
  // Global pollution hotspots
  const hotspots = [
    // Asia
    { top: '28%', left: '72%', color: '#cc0033', size: 14, label: 'Central Delhi', delay: 0 },
    { top: '30%', left: '77%', color: '#ff9933', size: 10, label: 'North Delhi', delay: 0.3 },
    { top: '32%', left: '82%', color: '#ffde33', size: 9, label: 'South Delhi', delay: 0.6 },
    { top: '42%', left: '75%', color: '#ff9933', size: 11, label: 'East Delhi', delay: 0.8 },
    { top: '22%', left: '47%', color: '#ffde33', size: 8, label: 'West Delhi', delay: 0.4 },
    { top: '23%', left: '49%', color: '#00e400', size: 7, label: 'New Delhi', delay: 0.5 },
    { top: '33%', left: '57%', color: '#cc0033', size: 10, label: 'Shahdara', delay: 1.0 },
    { top: '38%', left: '50%', color: '#ff9933', size: 11, label: 'North West Delhi', delay: 0.7 },
    { top: '52%', left: '48%', color: '#ffde33', size: 9, label: 'South West Delhi', delay: 1.2 },
  ];

  return (
    <div className="relative h-72 overflow-hidden" style={{ background: 'linear-gradient(135deg, #050a18, #0d1f3c, #0a1628)' }}>
      {/* Animated grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
      }} />
      
      {/* Animated dots for global hotspots */}
      <div className="absolute inset-0">
        {hotspots.map((dot, i) => (
          <div key={i} className="absolute group" style={{ top: dot.top, left: dot.left }}>
            {/* Pulse ring */}
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: dot.size * 2.5,
                height: dot.size * 2.5,
                top: -(dot.size * 0.75),
                left: -(dot.size * 0.75),
                backgroundColor: `${dot.color}20`,
                animationDelay: `${dot.delay}s`,
                animationDuration: '3s',
              }}
            />
            {/* Dot */}
            <div
              className="rounded-full cursor-pointer transition-transform hover:scale-150"
              style={{
                width: dot.size,
                height: dot.size,
                backgroundColor: dot.color,
                boxShadow: `0 0 ${dot.size}px ${dot.color}80, 0 0 ${dot.size * 3}px ${dot.color}30`,
              }}
            />
            {/* Label on hover */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-gray-900/90 px-2 py-0.5 rounded whitespace-nowrap">
              {dot.label}
            </div>
          </div>
        ))}
      </div>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 flex items-center justify-center border border-blue-500/15 animate-float">
            <Globe className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Delhi Pollution Map</h3>
          <p className="text-gray-500 text-xs">
            Hover hotspots • Visit Map page for full views
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;