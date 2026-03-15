import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getAQIColor, 
  getAQICategory, 
  AQI_LEGEND, 
  FALLBACK_GLOBAL_AQI
} from '../components/Globe/globeUtils';
import { Map, Activity, Search, Info } from 'lucide-react';

const GlobeView = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [aqiData, setAqiData] = useState(FALLBACK_GLOBAL_AQI);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Delhi AQI data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/aqi/latest');
        if (res.ok) {
          const dataArray = await res.json();
          if (dataArray && dataArray.length > 0) {
            const dataObj = {};
            dataArray.forEach(item => {
              dataObj[item.district] = item;
            });
            setAqiData(prev => ({ ...prev, ...dataObj }));
          }
        }
      } catch (err) {
        console.log('Using fallback AQI data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Sorted districts for ranking
  const sortedDistricts = useMemo(() => {
    return Object.entries(aqiData)
      .map(([code, data]) => ({
        code,
        name: data.district || code,
        aqi: data.aqi,
        category: getAQICategory(data.aqi),
      }))
      .sort((a, b) => b.aqi - a.aqi);
  }, [aqiData]);

  // Filtered by search
  const filteredDistricts = useMemo(() => {
    if (!searchQuery) return sortedDistricts;
    const q = searchQuery.toLowerCase();
    return sortedDistricts.filter(c => 
      c.name.toLowerCase().includes(q)
    );
  }, [sortedDistricts, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const values = Object.values(aqiData).map(d => d.aqi);
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length) || 0,
      max: Math.max(...values, 0),
      min: Math.min(...values, 0),
      total: values.length,
    };
  }, [aqiData]);

  return (
    <div className={`min-h-[calc(100vh-80px)] ${isDark ? 'bg-[#050a18]' : 'bg-[#0a1628]'} text-white -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 p-6 lg:p-10`} style={{
      background: isDark 
        ? 'linear-gradient(135deg, #050a18 0%, #0a1628 50%, #0d1f3c 100%)'
        : 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #122a4f 100%)',
    }}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 mt-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
               <Map size={24} className="text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent tracking-tight">
                 Delhi Area Reports
               </h1>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:block"></div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                   {stats.total} Active Monitoring Stations
                 </p>
               </div>
             </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-4">
            <div className="glass-card px-6 py-3 border-white/5 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">City Average</span>
                <span className="text-3xl font-black leading-none" style={{ color: getAQIColor(stats.avg), textShadow: `0 0 20px ${getAQIColor(stats.avg)}40` }}>
                    {stats.avg}
                </span>
            </div>
            <div className="glass-card px-6 py-3 border-white/5 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Most Polluted</span>
                <span className="text-3xl font-black leading-none text-red-500" style={{ textShadow: `0 0 20px rgba(239,68,68,0.3)` }}>
                    {stats.max}
                </span>
            </div>
            <div className="glass-card px-6 py-3 border-white/5 flex flex-col items-center min-w-[120px]">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Cleanest</span>
                <span className="text-3xl font-black leading-none text-emerald-500" style={{ textShadow: `0 0 20px rgba(16,185,129,0.3)` }}>
                    {stats.min}
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column: Legend & Search */}
        <div className="xl:col-span-1 space-y-6">
            {/* Search Box */}
            <div className="glass-card p-6 border-white/5">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Search size={16} className="text-blue-400" /> Search Areas
               </h3>
               <div className="relative">
                   <input
                        type="text"
                        placeholder="Search for a district..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a1628] border border-white/10 text-white px-4 py-3 pl-10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder:text-gray-600"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               </div>
            </div>

            {/* Scale Legend */}
            <div className="glass-card p-6 border-white/5 hidden md:block">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Info size={16} className="text-blue-400" /> AQI Scale Reference
              </h3>
              <div className="space-y-3">
                {AQI_LEGEND.map((item, i) => (
                  <div key={i} className="flex grid grid-cols-12 items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="col-span-2 w-6 h-6 rounded-md flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                    <div className="col-span-10 flex flex-col">
                        <span className="text-xs font-bold text-white">{item.range}</span>
                        <span className="text-[10px] text-gray-400">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right Column: Grid List of Areas */}
        <div className="xl:col-span-3">
             <div className="glass-card p-6 md:p-8 border-white/5 min-h-[500px]">
                <div className="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Area Rankings
                    </h2>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{filteredDistricts.length} results found</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-4 animate-pulse">Synchronizing Details...</p>
                    </div>
                ) : filteredDistricts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 font-bold">No areas found matching "{searchQuery}"</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredDistricts.map((district, idx) => (
                            <div 
                                key={district.code}
                                className="group relative flex items-center justify-between p-4 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.1] transition-all duration-300"
                            >
                                {/* Left side: Rank & Name */}
                                <div className="flex items-center gap-4 min-w-[200px]">
                                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-xs font-black text-gray-500 group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                    <h3 className="font-bold text-white text-[15px] tracking-tight">{district.name}</h3>
                                </div>

                                {/* Middle: Minimal Health Bar */}
                                <div className="hidden md:flex flex-1 max-w-[250px] mx-8 flex-col justify-center">
                                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ 
                                                width: `${Math.min((district.aqi / 300) * 100, 100)}%`,
                                                backgroundColor: getAQIColor(district.aqi),
                                                boxShadow: `0 0 10px ${getAQIColor(district.aqi)}`
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Right side: AQI Data & Status Pill */}
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black leading-none tracking-tighter" style={{ color: getAQIColor(district.aqi) }}>
                                            {district.aqi}
                                        </span>
                                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">PM2.5</span>
                                    </div>

                                    <div className="w-[110px] flex justify-end">
                                        <div className="w-full px-2 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-widest border text-center" style={{ 
                                            backgroundColor: `${getAQIColor(district.aqi)}10`,
                                            borderColor: `${getAQIColor(district.aqi)}30`,
                                            color: getAQIColor(district.aqi)
                                        }}>
                                            {district.category}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeView;
