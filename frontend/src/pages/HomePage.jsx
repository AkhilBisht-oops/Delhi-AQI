import React, { useRef, useState, useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, ArrowRight, ChevronRight, Globe, MapPin, TrendingUp } from 'lucide-react';
import HomeNavbar from '../components/Home/HomeNavbar';
import AnimatedHeadline from '../components/Home/AnimatedHeadline';
import LiveMonitoring from '../components/Home/LiveMonitoring';

// Error boundary for WebGL
class GlobeBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-[120px] animate-float select-none">🌍</div>
        </div>
      );
    }
    return this.props.children;
  }
}

const EarthGlobe = React.lazy(() => import('../components/Home/EarthGlobe'));

export default function HomePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => setScrollVal(v));
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Parallax transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[200vh] bg-[#030712] overflow-x-hidden"
      style={{ scrollBehavior: 'smooth' }}
    >
      <HomeNavbar />

      {/* ===== FULL-SCREEN 3D GLOBE BACKGROUND (sticky) ===== */}
      <div className="sticky top-0 w-full h-screen z-0">
        <div className="absolute inset-0">
          <React.Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#030712]">
                <div className="text-[120px] animate-float select-none">🌍</div>
              </div>
            }
          >
            <GlobeBoundary>
              <EarthGlobe scrollProgress={scrollVal} />
            </GlobeBoundary>
          </React.Suspense>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#030712]/40 via-transparent to-[#030712]/90 pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#030712]/50 via-transparent to-[#030712]/50 pointer-events-none" />

        {/* ===== HERO CONTENT (overlaid on globe) ===== */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pt-20"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <AnimatedHeadline />

          {/* CTA Button */}
          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <Link to="/dashboard">
              <motion.button
                className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-2xl text-base md:text-lg font-bold text-white overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
                {/* Shimmer */}
                <div className="absolute inset-0 animate-shimmer" />
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
              <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1.5">
                <motion.div
                  className="w-1 h-2 rounded-full bg-blue-400"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== SCROLLABLE CONTENT BELOW ===== */}
      <div className="relative z-10 bg-[#030712]">
        {/* Seamless transition gradient */}
        <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#030712] pointer-events-none" />

        {/* Live Monitoring Section */}
        <LiveMonitoring />

        {/* Quick Navigation */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.h3
              className="text-center text-sm font-bold text-gray-500 uppercase tracking-[0.25em] mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Explore More
            </motion.h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  label: 'Dashboard',
                  desc: 'Detailed analytics',
                  href: '/dashboard',
                  icon: <BarChart3 className="w-5 h-5" />,
                  gradient: 'from-blue-500/15 to-purple-500/15',
                  border: 'border-blue-500/20',
                  text: 'text-blue-400',
                  glow: 'rgba(59,130,246,0.1)',
                },
                {
                  label: 'Global AQI',
                  desc: '3D interactive globe',
                  href: '/globe',
                  icon: <Globe className="w-5 h-5" />,
                  gradient: 'from-cyan-500/15 to-blue-500/15',
                  border: 'border-cyan-500/20',
                  text: 'text-cyan-400',
                  glow: 'rgba(6,182,212,0.1)',
                },
                {
                  label: 'Heatmap',
                  desc: 'Pollution heatmap',
                  href: '/heatmap',
                  icon: <MapPin className="w-5 h-5" />,
                  gradient: 'from-orange-500/15 to-red-500/15',
                  border: 'border-orange-500/20',
                  text: 'text-orange-400',
                  glow: 'rgba(249,115,22,0.1)',
                },
                {
                  label: 'Trends',
                  desc: 'Historical data',
                  href: '/trends',
                  icon: <TrendingUp className="w-5 h-5" />,
                  gradient: 'from-emerald-500/15 to-cyan-500/15',
                  border: 'border-emerald-500/20',
                  text: 'text-emerald-400',
                  glow: 'rgba(16,185,129,0.1)',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={item.href}>
                    <motion.div
                      className={`group p-5 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} cursor-pointer transition-shadow duration-300`}
                      style={{ boxShadow: `0 0 30px ${item.glow}` }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className={item.text}>{item.icon}</div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="mt-3">
                        <div className="text-sm font-bold text-white">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] py-8 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AQI Pro</span>
            </div>
            <p className="text-xs text-gray-500">
              © 2026 AQI Pro. Global Air Quality Monitoring Platform.
            </p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Support'].map((t) => (
                <a key={t} href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
