import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';
// REMOVE Logo import since we're not using it in TopBar
import { 
  Search,
  Menu,
  Moon,
  Sun,
  Bell,
  AlertCircle
} from 'lucide-react';

const TopBar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 border-b transition-colors duration-200 backdrop-blur-lg bg-opacity-80 shadow-sm"
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(17, 24, 39, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Button & App Name */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors mr-3 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Simple app name without Logo - Logo will be in Sidebar */}
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AQI Pro
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Air Quality Intelligence</p>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities, districts, or pollutants..."
                className={`block w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Right Section - Theme, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Emergency Alert */}
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative group">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <div className="absolute right-0 top-full mt-2 w-48 p-3 rounded-lg shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="text-sm font-medium">Air Quality Alert</div>
                <div className="text-xs text-gray-500 mt-1">AQI: 245 (Very Unhealthy)</div>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;