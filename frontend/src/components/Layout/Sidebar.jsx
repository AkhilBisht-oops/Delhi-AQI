import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Lightbulb,
  Bell,
  Shield,
  Users,
  Globe
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: 'Real-time monitoring'
    },
    { 
      name: 'Global AQI', 
      href: '/globe', 
      icon: <Globe className="w-5 h-5" />,
      description: '3D World pollution map'
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-[#080e1f] border-r border-white/5">
          {/* Navigation */}
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
                    `flex items-center px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`mr-3 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-xs opacity-60">{item.description}</div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-white/50"></div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          {user && (
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-200">{user.name || 'User'}</div>
                  <div className="text-sm text-gray-500">
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