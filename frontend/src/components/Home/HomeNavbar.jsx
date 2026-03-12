import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function HomeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        backgroundColor: scrolled
          ? 'rgba(5, 10, 24, 0.85)'
          : 'rgba(5, 10, 24, 0.2)',
        backdropFilter: `blur(${scrolled ? '24px' : '12px'}) saturate(180%)`,
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-4 md:py-5'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050a18] shadow-lg shadow-emerald-400/50" />
            </motion.div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white tracking-tight">AQI</span>
                <span className="text-lg font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Pro
                </span>
              </div>
              <div className="text-[10px] text-gray-500 -mt-1 font-medium tracking-wider uppercase">
                Air Quality Intelligence
              </div>
            </div>
          </Link>

          {/* Desktop nav — floating pill */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <motion.div
                      className={`relative px-5 py-2 rounded-xl text-[13px] font-semibold transition-colors duration-300 ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20"
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right side — CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Live badge (desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Live
              </span>
            </div>

            {/* Dashboard CTA (desktop) */}
            <Link to="/dashboard" className="hidden md:block">
              <motion.button
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                Open Dashboard
              </motion.button>
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/[0.06] transition-all"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/5"
          >
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/70 to-purple-600/70 text-white shadow-lg shadow-blue-500/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              {/* Mobile Dashboard CTA */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.08, duration: 0.3 }}
                className="pt-2"
              >
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/15"
                >
                  Open Dashboard
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
