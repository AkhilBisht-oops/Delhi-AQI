import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Lightbulb, Shield, Leaf, Wind } from 'lucide-react';

const Tips = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');

  const tipsByCategory = {
    prevention: [
      {
        title: 'Use Air Purifiers',
        description: 'HEPA filters can remove 99.97% of airborne particles',
        icon: '💨',
        impact: 'High',
        cost: 'Medium'
      },
      {
        title: 'Indoor Plants',
        description: 'Spider plants, snake plants, and peace lilies naturally filter air',
        icon: '🌿',
        impact: 'Medium',
        cost: 'Low'
      },
      {
        title: 'Ventilation Timing',
        description: 'Open windows during early morning or late evening when pollution is lower',
        icon: '⏰',
        impact: 'High',
        cost: 'Free'
      }
    ],
    masks: [
      {
        title: 'N95 Masks',
        description: 'Blocks 95% of airborne particles. Essential for outdoor activities in poor air quality',
        icon: '😷',
        impact: 'Very High',
        cost: 'Low'
      },
      {
        title: 'Proper Fit',
        description: 'Ensure mask fits snugly around nose and mouth with no gaps',
        icon: '✅',
        impact: 'High',
        cost: 'Free'
      },
      {
        title: 'Regular Replacement',
        description: 'Replace masks every 8-10 hours of use or when breathing becomes difficult',
        icon: '🔄',
        impact: 'High',
        cost: 'Medium'
      }
    ],
    lifestyle: [
      {
        title: 'Exercise Indoors',
        description: 'Use gyms or indoor spaces for physical activities during high pollution days',
        icon: '🏋️',
        impact: 'High',
        cost: 'Varies'
      },
      {
        title: 'Stay Hydrated',
        description: 'Drink plenty of water to help your body flush out pollutants',
        icon: '💧',
        impact: 'Medium',
        cost: 'Free'
      },
      {
        title: 'Anti-inflammatory Diet',
        description: 'Foods rich in antioxidants (berries, nuts, leafy greens) help combat pollution effects',
        icon: '🥗',
        impact: 'Medium',
        cost: 'Low'
      }
    ],
    emergency: [
      {
        title: 'Air Quality Alerts',
        description: 'Subscribe to real-time alerts to stay informed about pollution spikes',
        icon: '🚨',
        impact: 'Very High',
        cost: 'Free'
      },
      {
        title: 'Emergency Kit',
        description: 'Keep N95 masks, inhaler (if asthmatic), and water readily available',
        icon: '🧰',
        impact: 'High',
        cost: 'Low'
      },
      {
        title: 'Avoid Outdoor Activities',
        description: 'Stay indoors when AQI exceeds 200 (Unhealthy)',
        icon: '🏠',
        impact: 'Very High',
        cost: 'Free'
      }
    ]
  };

  const allTips = Object.values(tipsByCategory).flat();

  const categories = [
    { id: 'all', name: 'All Tips', count: allTips.length },
    { id: 'prevention', name: 'Prevention', count: tipsByCategory.prevention.length },
    { id: 'masks', name: 'Masks & Protection', count: tipsByCategory.masks.length },
    { id: 'lifestyle', name: 'Lifestyle', count: tipsByCategory.lifestyle.length },
    { id: 'emergency', name: 'Emergency', count: tipsByCategory.emergency.length },
  ];

  const displayTips = activeCategory === 'all' ? allTips : tipsByCategory[activeCategory];

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'Very High': return 'text-red-600 dark:text-red-400';
      case 'High': return 'text-orange-600 dark:text-orange-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCostColor = (cost) => {
    switch(cost) {
      case 'Free': return 'text-green-600 dark:text-green-400';
      case 'Low': return 'text-yellow-600 dark:text-yellow-400';
      case 'Medium': return 'text-orange-600 dark:text-orange-400';
      case 'High': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                <Lightbulb className="w-8 h-8 mr-3" />
                Pollution Control Tips
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                Practical advice to protect yourself and reduce air pollution
            </p>
        </div>

      {/* Hero Section */}
        <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Protection Tips
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm flex items-center">
                <Leaf className="w-4 h-4 mr-1" />
                Indoor Safety
            </span>
            <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm flex items-center">
                <Wind className="w-4 h-4 mr-1" />
                Air Quality
            </span>
        </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {category.name}
            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
              activeCategory === category.id
                ? 'bg-blue-700'
                : theme === 'dark'
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTips.map((tip, index) => (
          <div 
            key={index}
            className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
                : 'bg-white border-gray-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{tip.icon}</div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(tip.impact)}`}>
                  Impact: {tip.impact}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getCostColor(tip.cost)}`}>
                  Cost: {tip.cost}
                </span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">{tip.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {tip.description}
            </p>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                💡 <span className="font-medium">Quick Tip:</span> Implement immediately for best results
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className={`p-6 rounded-2xl border ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">📚 Educational Materials</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Air Pollution 101 Guide</a></li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Health Effects Research</a></li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Children Protection Guide</a></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">🛒 Recommended Products</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Best Air Purifiers 2024</a></li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Effective Masks Comparison</a></li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Pollution Monitoring Devices</a></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">📱 Mobile Apps</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">AQI Notifications App</a></li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Pollution Forecast</a></li>
              <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Health Tracking</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className={`p-8 rounded-2xl border text-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
      }`}>
        <h2 className="text-2xl font-bold mb-4">Stay Protected, Stay Informed</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          Subscribe to our alerts to receive real-time pollution updates and personalized recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            Subscribe to Alerts
          </button>
          <button className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Download PDF Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tips;