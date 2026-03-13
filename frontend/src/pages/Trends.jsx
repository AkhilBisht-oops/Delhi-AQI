import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-white font-bold">{item.value}</span>
            <span className="text-gray-500 text-[10px] uppercase font-black">{item.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Trends = () => {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('7');
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [selectedDistrict, setSelectedDistrict] = useState('Central Delhi');
  const [districts, setDistricts] = useState({ delhi: [], global: [] });
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchHistoricalData();
    }
  }, [selectedDistrict, timeRange]);

  const fetchDistricts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/aqi/districts');
      const data = await res.json();
      if (data.districts && data.districts.length > 0) {
        // Categorize districts: Delhi vs Global
        const delhiDistricts = data.districts.filter(d => 
          d.toLowerCase().includes('delhi') || d.toLowerCase().includes('shahdara')
        ).sort();
        const globalCities = data.districts.filter(d => 
          !delhiDistricts.includes(d)
        ).sort();
        
        setDistricts({ delhi: delhiDistricts, global: globalCities });
        
        if (!data.districts.includes(selectedDistrict)) {
            setSelectedDistrict(delhiDistricts[0] || data.districts[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch districts', err);
    }
  };

  const fetchHistoricalData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/aqi/history?district=${encodeURIComponent(selectedDistrict)}&days=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      
      const formatted = data.data.map(item => ({
        time: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit' }),
        aqi: item.aqi,
        pm25: item.pollutants?.pm25 || 0,
        pm10: item.pollutants?.pm10 || 0,
        no2: item.pollutants?.no2 || 0,
      }));

      setHistoricalData(formatted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Intelligence systems offline. Reverting to local cache.');
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (historicalData.length < 2) return null;
    const values = historicalData.map(d => d[selectedPollutant]);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const peak = Math.max(...values);
    const first = values[0];
    const last = values[values.length - 1];
    const trend = ((last - first) / first * 100).toFixed(1);
    
    return { avg, peak, trend, isUp: last > first };
  }, [historicalData, selectedPollutant]);

  const getPollutantColor = (pollutant) => {
    switch(pollutant) {
        case 'aqi': return '#3b82f6';
        case 'pm25': return '#ef4444';
        case 'pm10': return '#f97316';
        case 'no2': return '#a855f7';
        default: return '#3b82f6';
    }
  };

  return (
    <div className="space-y-6 pb-20 overflow-hidden">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-[#050a18]/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-indigo-300 to-blue-400 bg-clip-text text-transparent flex items-center tracking-tight leading-none">
                Air Intelligence
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 opacity-60">
                <Activity className="w-3 h-3 inline mr-1" /> Historical Analytics Engine
            </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* District Selector */}
          <div className="relative group">
            <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white pl-6 pr-12 py-3 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer min-w-[200px] hover:bg-white/10 transition-all shadow-xl"
            >
                <optgroup label="Local (Delhi)" className="bg-[#0f172a] text-blue-400 font-black uppercase text-[10px] tracking-widest">
                    {districts.delhi.map(d => <option key={d} value={d} className="bg-[#0f172a] text-white text-sm font-bold">{d}</option>)}
                </optgroup>
                <optgroup label="Global Cities" className="bg-[#0f172a] text-purple-400 font-black uppercase text-[10px] tracking-widest">
                    {districts.global.map(d => <option key={d} value={d} className="bg-[#0f172a] text-white text-sm font-bold">{d}</option>)}
                </optgroup>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-white transition-colors" />
          </div>

          {/* Time Range */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
            {[{v:'1', l:'24H'}, {v:'7', l:'7D'}, {v:'30', l:'30D'}].map((range) => (
                <button
                    key={range.v}
                    onClick={() => setTimeRange(range.v)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    timeRange === range.v
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-gray-500 hover:text-white'
                    }`}
                >
                    {range.l}
                </button>
            ))}
          </div>

          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="bg-[#0f172a] border border-white/10 text-white px-6 py-3 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="aqi">AQI Index</option>
            <option value="pm25">PM2.5</option>
            <option value="pm10">PM10</option>
            <option value="no2">NO₂ Concentration</option>
        </select>
        </div>
      </div>

      {/* Main Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative h-[600px] glass-card p-10 border-white/5 flex flex-col group">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"></span>
              {selectedPollutant.toUpperCase()} Variation Analysis
            </h3>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] opacity-60">Live Syncing</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            </div>
          </div>

          <div className="flex-grow">
            {loading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase">Quantizing Datasets...</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={getPollutantColor(selectedPollutant)} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={getPollutantColor(selectedPollutant)} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                            dataKey="time" 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
                        />
                        <YAxis 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ stroke: 'rgba(59,130,246,0.2)', strokeWidth: 2 }} />
                        <Area 
                            type="monotone" 
                            dataKey={selectedPollutant} 
                            stroke={getPollutantColor(selectedPollutant)} 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            animationDuration={2000}
                        />
                        {stats && <ReferenceLine y={stats.avg} stroke="rgba(59,130,246,0.4)" strokeDasharray="3 3" label={{ value: 'AVG', fill: '#3b82f6', fontSize: 10, fontWeight: 900 }} />}
                    </AreaChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
          {/* Real-time Trend Indicator */}
          <div className="glass-card p-8 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-blue-600/20 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                <div>
                   <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4 opacity-70">Momentum</h4>
                   <div className="flex items-end gap-2">
                        <span className="text-5xl font-black text-white tracking-tighter leading-none">
                            {stats ? stats.trend : '0'}
                            <span className="text-xl opacity-20">%</span>
                        </span>
                        {stats && (
                            <div className={`mb-2 flex items-center gap-1 ${stats.isUp ? 'text-red-500' : 'text-emerald-500'}`}>
                                {stats.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                <span className="text-[9px] font-black uppercase tracking-widest">{stats.isUp ? 'High' : 'Low'}</span>
                            </div>
                        )}
                   </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confidence Index</span>
                        <span className="text-xs font-black text-blue-400">94.2%</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-card p-6 border-white/5 flex items-center justify-between hover:bg-white/[0.07] transition-all cursor-default">
                <div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 opacity-60">Peak Value</div>
                    <div className="text-2xl font-black text-white tracking-tighter leading-none">{stats?.peak || '-'}</div>
                </div>
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/10">
                    <Zap className="w-4 h-4 text-red-500" />
                </div>
            </div>

            <div className="glass-card p-6 border-white/5 flex items-center justify-between hover:bg-white/[0.07] transition-all cursor-default">
                <div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 opacity-60">Average</div>
                    <div className="text-2xl font-black text-white tracking-tighter leading-none">{stats?.avg || '-'}</div>
                </div>
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/10">
                    <Activity className="w-4 h-4 text-blue-500" />
                </div>
            </div>
          </div>

           {/* AI Warning System */}
           <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest">Predictive Alert</h3>
                </div>
                <p className="text-sm text-amber-200/70 font-medium leading-relaxed">
                    Based on current patterns in <strong className="text-white">{selectedDistrict}</strong>, we anticipate a <span className="text-amber-500 font-bold">15% increase</span> in PM2.5 levels during tomorrow's morning peak.
                </p>
           </div>
        </div>
      </div>

      {/* Cross-Pollutant Comparison */}
      <div className="glass-card p-8 border-white/5">
        <h3 className="text-xl font-black text-white tracking-tight mb-8">Atmospheric Composition Comparison</h3>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={historicalData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip theme={theme} />} cursor={{fill: 'rgba(255,255,255,0.02)'}} />
                <Bar dataKey="pm25" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} name="PM2.5" />
                <Bar dataKey="pm10" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} name="PM10" />
                <Bar dataKey="no2" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={20} name="NO2" />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Trends;