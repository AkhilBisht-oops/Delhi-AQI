import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, Globe } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Contact</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
          Get in
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> Touch</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Have questions about air quality data or our platform? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Contact info */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'support@aqipro.com', color: 'text-blue-400', glow: 'rgba(59,130,246,0.1)' },
            { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'New Delhi, India', color: 'text-purple-400', glow: 'rgba(139,92,246,0.1)' },
            { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 98765 43210', color: 'text-emerald-400', glow: 'rgba(16,185,129,0.1)' },
            { icon: <Clock className="w-5 h-5" />, label: 'Hours', value: 'Mon–Fri, 9AM–6PM IST', color: 'text-cyan-400', glow: 'rgba(6,182,212,0.1)' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] backdrop-blur-xl hover:-translate-y-0.5 transition-transform duration-300"
              style={{ background: 'rgba(15,23,42,0.5)', boxShadow: `0 0 30px ${item.glow}` }}
            >
              <div className={`${item.color} mt-0.5`}>{item.icon}</div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">{item.label}</div>
                <div className="text-sm text-white font-medium">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Contact form */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 rounded-2xl border border-white/[0.06] backdrop-blur-xl"
            style={{ background: 'rgba(15,23,42,0.5)' }}
          >
            <h3 className="text-lg font-bold text-white mb-6">Send a Message</h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-all resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
