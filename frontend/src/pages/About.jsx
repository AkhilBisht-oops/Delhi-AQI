import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Users, Zap, Heart } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">About Us</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
          Monitoring the Planet's
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Air Quality
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          AQI Pro is a comprehensive Delhi air quality intelligence platform providing real-time pollution data,
          predictive analytics, and actionable health insights across Delhi NCR areas.
        </p>
      </motion.div>

      {/* Mission cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {[
          {
            icon: <Shield className="w-6 h-6" />,
            title: 'Our Mission',
            desc: 'Empowering communities in Delhi with transparent, real-time air quality data to protect public health and drive environmental action.',
            color: 'text-blue-400',
            glow: 'rgba(59,130,246,0.1)',
            border: 'border-blue-500/15',
          },
          {
            icon: <Zap className="w-6 h-6" />,
            title: 'Real-time Data',
            desc: 'Our platform aggregates data from thousands of monitoring stations, satellites, and IoT sensors to deliver second-by-second pollution updates.',
            color: 'text-purple-400',
            glow: 'rgba(139,92,246,0.1)',
            border: 'border-purple-500/15',
          },
          {
            icon: <Heart className="w-6 h-6" />,
            title: 'Health First',
            desc: 'We translate complex pollution data into clear health recommendations, helping you make informed decisions about outdoor activities.',
            color: 'text-emerald-400',
            glow: 'rgba(16,185,129,0.1)',
            border: 'border-emerald-500/15',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className={`p-6 rounded-2xl border ${card.border} backdrop-blur-xl hover:-translate-y-1 transition-transform duration-300`}
            style={{ background: 'rgba(15,23,42,0.5)', boxShadow: `0 0 40px ${card.glow}` }}
          >
            <div className={`${card.color} mb-4`}>{card.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {[
          { label: 'Areas', value: '11+', color: 'text-blue-400' },
          { label: 'Monitoring Stations', value: '12K+', color: 'text-purple-400' },
          { label: 'Daily Users', value: '500K+', color: 'text-cyan-400' },
          { label: 'Data Points/Day', value: '10M+', color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="text-center p-5 rounded-2xl border border-white/[0.06] backdrop-blur-xl" style={{ background: 'rgba(15,23,42,0.4)' }}>
            <div className={`text-3xl md:text-4xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
