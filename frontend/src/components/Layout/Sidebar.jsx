import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

// Import professional icons
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Lightbulb,
  Bell,
  Shield,
  Users,
  Cloud
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { user, isAdmin } = useAuth();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: 'Real-time monitoring'
    },
    { 
      name: 'Heatmap', 
      href: '/heatmap', 
      icon: <Map className="w-5 h-5" />,
      description: 'Pollution visualization'
    },
    { 
      name: 'Trends', 
      href: '/trends', 
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Historical analysis'
    },
    { 
      name: 'Pollution Tips', 
      href: '/tips', 
      icon: <Lightbulb className="w-5 h-5" />,
      description: 'Health recommendations'
    },
    { 
      name: 'Alerts', 
      href: '/alerts', 
      icon: <Bell className="w-5 h-5" />,
      description: 'Notification settings',
      protected: true 
    },
    ...(isAdmin ? [{ 
      name: 'Admin Panel', 
      href: '/admin', 
      icon: <Shield className="w-5 h-5" />,
      description: 'System management',
      admin: true 
    }] : []),
  ];

  return (
    <>
      {/* Sidebar for mobile */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className={`flex flex-col h-full ${
          theme === 'dark' 
            ? 'bg-gray-900 border-r border-gray-800' 
            : 'bg-white border-r border-gray-200'
        }`}>
          {/* Sidebar header */}
          {/* <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
            <Logo size="md" showText={true} />
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div> */}

          {/* Navigation - FIXED VERSION */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.protected && !user) return null;
              if (item.admin && !isAdmin) return null;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (  // ✅ Get isActive as children prop
                    <>
                      <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User info at bottom */}
          {user && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <div className="font-medium">{user.name || 'User'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {isAdmin ? 'Administrator' : 'Premium User'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;