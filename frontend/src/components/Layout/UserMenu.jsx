import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = () => {
  const { theme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex space-x-3">
        <Link
          to="/login"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="font-medium">{user.name || 'User'}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
          }}
        >
          <div className="py-1">
            <Link
              to="/alerts"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Alerts
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;