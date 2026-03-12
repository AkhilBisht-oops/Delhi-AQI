import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import GlobeScene from '../components/Globe/GlobeScene';
import { 
  getAQIColor, 
  getAQICategory, 
  getAQIEmoji, 
  AQI_LEGEND, 
  FALLBACK_GLOBAL_AQI,
  COUNTRY_CENTROIDS 
} from '../components/Globe/globeUtils';
import { Globe as GlobeIcon, Wind, Activity, Search, ChevronDown, ChevronUp, Info } from 'lucide-react';

const GlobeView = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [aqiData, setAqiData] = useState(FALLBACK_GLOBAL_AQI);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAllCountries, setShowAllCountries] = useState(false);

  // Fetch global AQI data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/aqi/global');
        if (res.ok) {
          const data = await res.json();
          if (Object.keys(data).length > 0) {
            setAqiData(prev => ({ ...prev, ...data }));
          }
        }
      } catch (err) {
        console.log('Using fallback AQI data for globe');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Sorted countries for ranking
  const sortedCountries = useMemo(() => {
    return Object.entries(aqiData)
      .map(([code, data]) => ({
        code,
        name: COUNTRY_CENTROIDS[code]?.name || code,
        aqi: data.aqi,
        city: data.city,
        category: getAQICategory(data.aqi),
      }))
      .sort((a, b) => b.aqi - a.aqi);
  }, [aqiData]);

  // Filtered by search
  const filteredCountries = useMemo(() => {
    if (!searchQuery) return sortedCountries;
    const q = searchQuery.toLowerCase();
    return sortedCountries.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q)
    );
  }, [sortedCountries, searchQuery]);

  const displayedCountries = showAllCountries ? filteredCountries : filteredCountries.slice(0, 10);

  // Stats
  const stats = useMemo(() => {
    const values = Object.values(aqiData).map(d => d.aqi);
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      max: Math.max(...values),
      min: Math.min(...values),
      total: values.length,
      good: values.filter(v => v <= 50).length,
      hazardous: values.filter(v => v > 300).length,
    };
  }, [aqiData]);

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark 
        ? 'linear-gradient(135deg, #050a18 0%, #0a1628 50%, #0d1f3c 100%)'
        : 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #122a4f 100%)',
      color: '#ffffff',
      padding: 0,
      margin: '-2rem',
      marginTop: '-2rem',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10, 15, 30, 0.6)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          }}>
            <GlobeIcon size={24} color="white" />
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 800,
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>
              Global Air Quality Index
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              Real-time worldwide pollution monitoring • {stats.total} countries tracked
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '13px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              animation: 'pulse 2s infinite',
            }} />
            LIVE
          </div>
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.6)',
          }}>
            Avg AQI: <strong style={{ color: getAQIColor(stats.avg) }}>{stats.avg}</strong>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 88px)',
        position: 'relative',
      }}>
        
        {/* 3D Globe */}
        <div style={{ 
          flex: 1,
          position: 'relative',
          minHeight: '500px',
        }}>
          <GlobeScene 
            aqiData={aqiData} 
            onSelectCountry={setSelectedCountry}
          />
          
          {/* Floating stats cards */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            gap: '12px',
            zIndex: 10,
          }}>
            {[
              { label: 'Cleanest', value: stats.min, icon: '🌿' },
              { label: 'Average', value: stats.avg, icon: '🌍' },
              { label: 'Most Polluted', value: stats.max, icon: '⚠️' },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '12px 18px',
                background: 'rgba(10, 15, 30, 0.85)',
                backdropFilter: 'blur(20px)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                minWidth: '120px',
              }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
                  {stat.icon} {stat.label}
                </div>
                <div style={{ 
                  fontSize: '22px', 
                  fontWeight: 800,
                  color: getAQIColor(stat.value),
                  textShadow: `0 0 20px ${getAQIColor(stat.value)}40`,
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{
          width: '360px',
          background: 'rgba(10, 15, 30, 0.7)',
          backdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          
          {/* Selected Country Detail */}
          {selectedCountry && (
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: `${getAQIColor(selectedCountry.aqi)}20`,
                  border: `2px solid ${getAQIColor(selectedCountry.aqi)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  {getAQIEmoji(selectedCountry.aqi)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>{selectedCountry.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    {selectedCountry.city && `📍 ${selectedCountry.city}`}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px',
                borderRadius: '12px',
                background: `${getAQIColor(selectedCountry.aqi)}15`,
                border: `1px solid ${getAQIColor(selectedCountry.aqi)}30`,
              }}>
                <div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: getAQIColor(selectedCountry.aqi) }}>
                    {selectedCountry.aqi ?? 'N/A'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>US AQI</div>
                </div>
                <div style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: `${getAQIColor(selectedCountry.aqi)}25`,
                  color: getAQIColor(selectedCountry.aqi),
                  fontSize: '13px',
                  fontWeight: 600,
                }}>
                  {getAQICategory(selectedCountry.aqi)}
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Search size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '14px',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* AQI Legend */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Info size={14} /> AQI Scale
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {AQI_LEGEND.map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  fontSize: '12px',
                }}>
                  <div style={{
                    width: '18px', height: '18px',
                    borderRadius: '4px',
                    background: item.color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${item.color}40`,
                  }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{item.range}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '6px' }}>
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Country Rankings */}
          <div style={{ padding: '16px 20px', flex: 1 }}>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Activity size={14} /> Most Polluted Countries
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {displayedCountries.map((country, i) => (
                <div
                  key={country.code}
                  onClick={() => setSelectedCountry(country)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: selectedCountry?.code === country.code
                      ? 'rgba(255,255,255,0.08)' 
                      : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedCountry?.code === country.code
                      ? `1px solid ${getAQIColor(country.aqi)}40`
                      : '1px solid transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 
                    selectedCountry?.code === country.code ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)'}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.4)',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{country.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                      {country.city}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: `${getAQIColor(country.aqi)}20`,
                    color: getAQIColor(country.aqi),
                    fontSize: '13px',
                    fontWeight: 700,
                    minWidth: '42px',
                    textAlign: 'center',
                  }}>
                    {country.aqi}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCountries.length > 10 && (
              <button
                onClick={() => setShowAllCountries(!showAllCountries)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '8px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                {showAllCountries ? (
                  <><ChevronUp size={14} /> Show Less</>
                ) : (
                  <><ChevronDown size={14} /> Show All {filteredCountries.length} Countries</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default GlobeView;
