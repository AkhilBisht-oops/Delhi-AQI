import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Lightbulb,
  Globe,
  Menu,
  X,
  Bell,
  AlertCircle,
  Zap,
  Home, // Added for new navLinks
  BarChart2, // Added for new navLinks
  Activity // Added for new navLinks
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
  { name: 'Trends', path: '/trends', icon: <BarChart2 size={18} /> },
  { name: 'Delhi Reports', path: '/globe', icon: <Map size={18} /> },
  { name: 'Heatmap', path: '/heatmap', icon: <Activity size={18} /> },
  { name: 'Pollution Tips', path: '/tips', icon: <Lightbulb size={18} /> }, // Changed href to path and icon size
];

const Navbar = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-2' 
          : 'py-3'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(5, 10, 24, 0.92)' : 'rgba(5, 10, 24, 0.5)',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <Globe className="w-5 h-5 text-white" />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050a18] shadow-lg shadow-emerald-400/50"></div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white tracking-tight">AQI</span>
                <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Pro</span>
              </div>
              <div className="text-[10px] text-gray-500 -mt-1 font-medium tracking-wider uppercase">Air Quality Intelligence</div>
            </div>
          </Link>

          {/* Center Navigation — pill container */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              {navLinks.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-white' : 'text-gray-500'}>{item.icon}</span>
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1.5">
            {/* Live badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Live</span>
            </div>

            {/* Alert */}
            <button className="relative p-2.5 rounded-xl hover:bg-white/[0.06] transition-all group hidden sm:block">
              <AlertCircle className="w-[18px] h-[18px] text-gray-400 group-hover:text-red-400 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-[#050a18]"></span>
            </button>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-white/[0.06] transition-all group hidden sm:block">
              <Bell className="w-[18px] h-[18px] text-gray-400 group-hover:text-blue-400 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[#050a18]"></span>
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/10 mx-1.5"></div>

            {/* User */}
            <UserMenu />

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-white/[0.06] transition-all ml-1"
            >
              {mobileOpen 
                ? <X className="w-5 h-5 text-gray-300" /> 
                : <Menu className="w-5 h-5 text-gray-300" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
        mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-white/5 mt-2">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/70 to-purple-600/70 text-white shadow-lg shadow-blue-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
