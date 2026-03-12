import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';
import { 
  Search,
  Menu,
  Bell,
  AlertCircle
} from 'lucide-react';

const TopBar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur-xl shadow-lg"
      style={{
        backgroundColor: 'rgba(10, 15, 30, 0.85)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors mr-3 lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-300" />
            </button>
            
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AQI Pro
              </h1>
              <p className="text-xs text-gray-500">Air Quality Intelligence</p>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities, districts, or pollutants..."
                className="block w-full pl-10 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-white/5 border-white/10 text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>

            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative group">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-xl shadow-2xl bg-gray-900/95 border border-white/10 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="text-sm font-medium text-white">Air Quality Alert</div>
                <div className="text-xs text-gray-400 mt-1">AQI: 245 (Very Unhealthy)</div>
              </div>
            </button>

            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;