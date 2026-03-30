import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import API_BASE_URL from '../api';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useTheme } from '../contexts/ThemeContext';
import delhiDistrictsGeoJSON from '../data/DelhiDistrictGeoJSON';
import {
  Map as MapIcon,
  Layers,
  AlertCircle,
  Activity,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  EyeOff,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  BarChart3,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Maximize2,
  Minimize2,
  Satellite,
  Grid3x3,
  CircleDot,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────── Map utility: pan/zoom changes ─────────── */
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

/* ─────────── Heatmap Layer Component (L.heatLayer) ─────────── */
function HeatmapLayer({ points, visible }) {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!visible) {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
      return;
    }

    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    if (points.length === 0) return;

    const heatPoints = points.map(p => [p.lat, p.lng, p.intensity]);

    heatRef.current = L.heatLayer(heatPoints, {
      radius: 45,
      blur: 30,
      maxZoom: 14,
      max: 500,
      minOpacity: 0.35,
      gradient: {
        0.0: '#22c55e',
        0.15: '#4ade80',
        0.30: '#eab308',
        0.45: '#f97316',
        0.60: '#ef4444',
        0.75: '#dc2626',
        0.85: '#a855f7',
        1.0: '#7e0023'
      }
    }).addTo(map);

    return () => {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
    };
  }, [points, visible, map]);

  return null;
}

/* ─────────── IDW Interpolation Grid Layer ─────────── */
function InterpolationGrid({ data, visible, selectedPollutant }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!visible || data.length < 2) return;

    const bounds = { minLat: 28.40, maxLat: 28.78, minLng: 76.95, maxLng: 77.40 };
    const step = 0.012;
    const rectangles = [];

    for (let lat = bounds.minLat; lat < bounds.maxLat; lat += step) {
      for (let lng = bounds.minLng; lng < bounds.maxLng; lng += step) {
        let numerator = 0, denominator = 0;
        for (const point of data) {
          const dist = Math.sqrt((lat - point.lat) ** 2 + (lng - point.lng) ** 2);
          if (dist < 0.001) { numerator = point[selectedPollutant]; denominator = 1; break; }
          const w = 1 / (dist ** 2.5);
          numerator += w * point[selectedPollutant];
          denominator += w;
        }
        const value = denominator > 0 ? numerator / denominator : 0;
        const color = getColorForValue(value, selectedPollutant);

        rectangles.push(
          L.rectangle(
            [[lat, lng], [lat + step, lng + step]],
            { color: 'transparent', fillColor: color, fillOpacity: 0.22, weight: 0 }
          )
        );
      }
    }

    layerRef.current = L.layerGroup(rectangles).addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [data, visible, selectedPollutant, map]);

  return null;
}

/* ─────────── Wind Particles (decorative) ─────────── */
function WindOverlay({ visible }) {
  const map = useMap();
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!visible) {
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const container = map.getContainer();
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:450;opacity:0.4;';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    const count = 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0.4 + Math.random() * 1.2,
      vy: -0.2 + Math.random() * 0.4,
      life: Math.random(),
      size: 1 + Math.random() * 2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        if (p.x > canvas.width || p.life <= 0) {
          p.x = 0;
          p.y = Math.random() * canvas.height;
          p.life = 1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.life * 0.5})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, [visible, map]);

  return null;
}

/* ─────────── Color utilities ─────────── */
function getColorForValue(value, type = 'aqi') {
  let v = value;
  if (type === 'pm25') v = value * 2;
  if (type === 'pm10') v = value;
  if (type === 'no2') v = value * 2.5;
  if (type === 'o3') v = value * 2;
  if (type === 'so2') v = value * 5;
  if (type === 'co') v = value / 20;

  if (v <= 50) return '#22c55e';
  if (v <= 100) return '#eab308';
  if (v <= 150) return '#f97316';
  if (v <= 200) return '#ef4444';
  if (v <= 300) return '#a855f7';
  return '#7e0023';
}

function getAQILevel(aqi) {
  if (aqi <= 50) return { label: 'Good', emoji: '😊' };
  if (aqi <= 100) return { label: 'Moderate', emoji: '😐' };
  if (aqi <= 150) return { label: 'Unhealthy (S)', emoji: '😷' };
  if (aqi <= 200) return { label: 'Unhealthy', emoji: '🤢' };
  if (aqi <= 300) return { label: 'Very Unhealthy', emoji: '💀' };
  return { label: 'Hazardous', emoji: '☠️' };
}

function getAQIGradient(aqi) {
  if (aqi <= 50) return 'from-emerald-500 to-green-400';
  if (aqi <= 100) return 'from-yellow-500 to-amber-400';
  if (aqi <= 150) return 'from-orange-500 to-amber-500';
  if (aqi <= 200) return 'from-red-500 to-rose-500';
  if (aqi <= 300) return 'from-purple-600 to-violet-500';
  return 'from-rose-900 to-red-800';
}

/* ─────────── Pollutant metadata ─────────── */
const POLLUTANTS = [
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', icon: Droplets, color: '#3b82f6', max: 250, who: 15 },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³', icon: Wind, color: '#06b6d4', max: 400, who: 45 },
  { key: 'no2', label: 'NO₂', unit: 'µg/m³', icon: Flame, color: '#f97316', max: 200, who: 25 },
  { key: 'o3', label: 'O₃', unit: 'µg/m³', icon: Zap, color: '#a855f7', max: 300, who: 100 },
  { key: 'so2', label: 'SO₂', unit: 'µg/m³', icon: Thermometer, color: '#eab308', max: 100, who: 40 },
  { key: 'co', label: 'CO', unit: 'µg/m³', icon: Activity, color: '#ef4444', max: 15000, who: 4000 },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const DelhiMap = () => {
  const { theme } = useTheme();

  /* ── State ── */
  const [globalData, setGlobalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPollutant, setSelectedPollutant] = useState('aqi');
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]);
  const [mapZoom, setMapZoom] = useState(11);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  // Layer visibility
  const [layers, setLayers] = useState({
    heatmap: true,
    markers: true,
    boundaries: true,
    interpolation: false,
    wind: false,
  });
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);

  // Time-lapse
  const [historyData, setHistoryData] = useState([]);
  const [timeIndex, setTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTimeLapse, setShowTimeLapse] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const timerRef = useRef(null);

  // Full screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ── Regions for quick navigation ── */
  const regions = [
    { id: 'all', label: 'All Delhi', center: [28.6139, 77.2090], zoom: 10 },
    { id: 'central', label: 'Central', center: [28.6358, 77.2245], zoom: 12 },
    { id: 'north', label: 'North', center: [28.7041, 77.1025], zoom: 12 },
    { id: 'south', label: 'South', center: [28.5355, 77.2500], zoom: 12 },
    { id: 'east', label: 'East', center: [28.6692, 77.3154], zoom: 12 },
    { id: 'west', label: 'West', center: [28.6562, 77.1000], zoom: 12 },
  ];

  /* ── Coordinates for Delhi districts ── */
  const delhiCoordinates = {
    'Central Delhi': { lat: 28.6358, lng: 77.2245 },
    'North Delhi': { lat: 28.7041, lng: 77.1025 },
    'South Delhi': { lat: 28.5355, lng: 77.2500 },
    'East Delhi': { lat: 28.6692, lng: 77.3154 },
    'West Delhi': { lat: 28.6562, lng: 77.1000 },
    'New Delhi': { lat: 28.6139, lng: 77.2090 },
    'North East Delhi': { lat: 28.7154, lng: 77.2842 },
    'North West Delhi': { lat: 28.7272, lng: 77.0688 },
    'South East Delhi': { lat: 28.5562, lng: 77.2760 },
    'South West Delhi': { lat: 28.5820, lng: 77.0707 },
    'Shahdara': { lat: 28.6714, lng: 77.2862 }
  };

  /* ── Fetch live data ── */
  const fetchDelhiData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/aqi/latest`);
      if (!res.ok) throw new Error('Failed to fetch Delhi data');
      const dataArray = await res.json();

      const formatted = dataArray.map((district) => {
        const coords = delhiCoordinates[district.district] || { lat: 28.6139, lng: 77.2090 };
        return {
          code: district.district,
          name: district.district,
          aqi: district.aqi,
          lat: coords.lat,
          lng: coords.lng,
          pm25: district.pollutants?.pm25 || Math.round(district.aqi * 0.7),
          pm10: district.pollutants?.pm10 || Math.round(district.aqi * 1.2),
          no2: district.pollutants?.no2 || Math.round(district.aqi * 0.3),
          o3: district.pollutants?.o3 || Math.round(district.aqi * 0.4),
          so2: district.pollutants?.so2 || Math.round(district.aqi * 0.15),
          co: district.pollutants?.co || Math.round(district.aqi * 10),
          category: district.category,
          timestamp: district.timestamp,
          status: getAQILevel(district.aqi)
        };
      });

      setGlobalData(formatted);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Live data connection interrupted. Retrying...');
      setLoading(false);
    }
  }, []);

  /* ── Fetch historical data for time-lapse ── */
  const fetchHistory = useCallback(async () => {
    try {
      const days = timeRange === '24h' ? 1 : 7;
      const allHistory = [];
      for (const name of Object.keys(delhiCoordinates)) {
        const res = await fetch(`${API_BASE_URL}/aqi/history?district=${encodeURIComponent(name)}&days=${days}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            allHistory.push(...json.data.map(d => ({ ...d, districtName: name })));
          }
        }
      }
      // Group by timestamp (nearest hour)
      const grouped = {};
      allHistory.forEach(item => {
        const ts = new Date(item.timestamp);
        const key = `${ts.getFullYear()}-${ts.getMonth()}-${ts.getDate()}-${ts.getHours()}`;
        if (!grouped[key]) grouped[key] = { timestamp: ts, districts: [] };
        const coords = delhiCoordinates[item.district || item.districtName] || { lat: 28.6139, lng: 77.2090 };
        grouped[key].districts.push({
          name: item.district || item.districtName,
          aqi: item.aqi,
          lat: coords.lat,
          lng: coords.lng,
          pm25: item.pollutants?.pm25 || Math.round(item.aqi * 0.7),
          pm10: item.pollutants?.pm10 || Math.round(item.aqi * 1.2),
        });
      });

      const sorted = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
      setHistoryData(sorted);
      setTimeIndex(0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDelhiData();
    const interval = setInterval(fetchDelhiData, 180000);
    return () => clearInterval(interval);
  }, [fetchDelhiData]);

  useEffect(() => {
    if (showTimeLapse) fetchHistory();
  }, [showTimeLapse, timeRange, fetchHistory]);

  /* ── Time-lapse playback ── */
  useEffect(() => {
    if (isPlaying && historyData.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeIndex(prev => {
          if (prev >= historyData.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, historyData.length]);

  /* ── Active data (live or time-lapse frame) ── */
  const activeData = useMemo(() => {
    if (showTimeLapse && historyData.length > 0 && historyData[timeIndex]) {
      return historyData[timeIndex].districts;
    }
    return globalData;
  }, [showTimeLapse, historyData, timeIndex, globalData]);

  /* ── Heatmap points ── */
  const heatmapPoints = useMemo(() => {
    return activeData.map(d => ({
      lat: d.lat,
      lng: d.lng,
      intensity: d[selectedPollutant] || d.aqi
    }));
  }, [activeData, selectedPollutant]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    if (activeData.length === 0) return null;
    const sorted = [...activeData].sort((a, b) => b.aqi - a.aqi);
    const avg = Math.round(activeData.reduce((acc, c) => acc + c.aqi, 0) / activeData.length);
    return {
      worst: sorted[0],
      best: sorted[sorted.length - 1],
      avg,
      total: activeData.length
    };
  }, [activeData]);

  /* ── Layer toggle ── */
  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  /* ── District click handler ── */
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    setPanelOpen(true);
    const coords = delhiCoordinates[district.name];
    if (coords) {
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(13);
    }
  };

  /* ── GeoJSON styling ── */
  const geoJsonStyle = useCallback((feature) => {
    const districtData = activeData.find(d =>
      d.name.toLowerCase().includes(feature.properties.name.toLowerCase().split(' ')[0])
    );
    const aqi = districtData?.aqi || 100;
    return {
      fillColor: getColorForValue(aqi, 'aqi'),
      fillOpacity: 0.15,
      color: getColorForValue(aqi, 'aqi'),
      weight: 1.5,
      dashArray: '4 4',
    };
  }, [activeData]);

  const geoJsonOnEachFeature = useCallback((feature, layer) => {
    const districtData = activeData.find(d =>
      d.name.toLowerCase().includes(feature.properties.name.toLowerCase().split(' ')[0])
    );
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 0.35, weight: 3, dashArray: '' });
      },
      mouseout: (e) => {
        e.target.setStyle({ fillOpacity: 0.15, weight: 1.5, dashArray: '4 4' });
      },
      click: () => {
        if (districtData) handleDistrictClick(districtData);
      }
    });
    if (districtData) {
      layer.bindTooltip(
        `<strong>${districtData.name}</strong><br/>AQI: ${districtData.aqi}`,
        { sticky: true, className: 'district-tooltip' }
      );
    }
  }, [activeData]);

  /* ── Tile URLs ── */
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  /* ── Layer config for toggle panel ── */
  const layerConfig = [
    { key: 'heatmap', label: 'Heat Map', icon: Grid3x3, color: '#f97316' },
    { key: 'markers', label: 'Stations', icon: CircleDot, color: '#3b82f6' },
    { key: 'boundaries', label: 'Boundaries', icon: MapIcon, color: '#a855f7' },
    { key: 'interpolation', label: 'IDW Grid', icon: Grid3x3, color: '#06b6d4' },
    { key: 'wind', label: 'Wind Flow', icon: Wind, color: '#22c55e' },
  ];

  const pollutantOptions = [
    { value: 'aqi', label: 'AQI Index' },
    { value: 'pm25', label: 'PM2.5' },
    { value: 'pm10', label: 'PM10' },
    { value: 'no2', label: 'NO₂' },
    { value: 'o3', label: 'O₃' },
    { value: 'so2', label: 'SO₂' },
    { value: 'co', label: 'CO' },
  ];

  return (
    <div className={`space-y-4 relative min-h-screen pb-8 ${isFullscreen ? 'fixed inset-0 z-[9999] bg-[#050a18] p-4' : ''}`}>
      {/* ═══════════ HEADER ═══════════ */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 heatmap-header">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent leading-tight tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <MapIcon className="w-5 h-5 text-blue-400" />
            </div>
            Delhi Pollution Intelligence
          </h1>
          <p className="text-gray-500 text-[10px] font-bold mt-1.5 uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Geospatial Feed • <span className="text-blue-400">{stats?.total || 0} Monitoring Stations</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Region Quick Links */}
          <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06]">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => { setMapCenter(r.center); setMapZoom(r.zoom); }}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:text-white text-gray-500 hover:bg-white/[0.06] active:scale-95"
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Pollutant Selector */}
          <select
            value={selectedPollutant}
            onChange={(e) => setSelectedPollutant(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] text-white px-4 py-2 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none cursor-pointer"
          >
            {pollutantOptions.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#0f172a]">{opt.label}</option>
            ))}
          </select>

          {/* Time-Lapse Toggle */}
          <button
            onClick={() => setShowTimeLapse(!showTimeLapse)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
              showTimeLapse
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                : 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Time-Lapse
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white transition-all active:scale-95"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ═══════════ MAIN GRID ═══════════ */}
      <div className={`grid grid-cols-1 ${panelOpen ? 'lg:grid-cols-[1fr_380px]' : 'lg:grid-cols-[1fr_320px]'} gap-4`}>

        {/* ─────── MAP CONTAINER ─────── */}
        <div className="relative rounded-[28px] overflow-hidden border border-white/[0.06] h-[700px] group shadow-2xl shadow-blue-900/20">
          {/* Loading overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className="absolute inset-0 z-[1000] bg-[#050a18] flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-[3px] border-blue-500/30 rounded-full"></div>
                  <div className="absolute inset-0 w-20 h-20 border-[3px] border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-2 w-16 h-16 border-[2px] border-purple-500/20 rounded-full"></div>
                  <div className="absolute inset-2 w-16 h-16 border-[2px] border-purple-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-blue-400 font-black tracking-[0.3em] text-[11px] uppercase mt-6 animate-pulse">
                  Synchronizing Stations
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leaflet Map */}
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', background: '#050a18' }}
            zoomControl={false}
            attributionControl={false}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer url={tileUrl} />

            {/* Heatmap Layer */}
            <HeatmapLayer points={heatmapPoints} visible={layers.heatmap} />

            {/* IDW Interpolation Grid */}
            <InterpolationGrid data={activeData} visible={layers.interpolation} selectedPollutant={selectedPollutant} />

            {/* Wind Overlay */}
            <WindOverlay visible={layers.wind} />

            {/* District Boundaries */}
            {layers.boundaries && (
              <GeoJSON
                key={JSON.stringify(activeData.map(d => d.aqi))}
                data={delhiDistrictsGeoJSON}
                style={geoJsonStyle}
                onEachFeature={geoJsonOnEachFeature}
              />
            )}

            {/* Circle Markers */}
            {layers.markers && activeData.map((city) => {
              const value = city[selectedPollutant] || city.aqi;
              const color = getColorForValue(value, selectedPollutant);
              return (
                <CircleMarker
                  key={city.code || city.name}
                  center={[city.lat, city.lng]}
                  radius={Math.max(8, Math.min(value / 12 + 4, 25))}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.55,
                    color: color,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => handleDistrictClick(city)
                  }}
                >
                  <Popup className="aqi-popup-custom">
                    <div className="heatmap-popup">
                      <div className="heatmap-popup-header">
                        <span className="heatmap-popup-title">{city.name}</span>
                        <span className="heatmap-popup-badge" style={{ background: color + '30', color: color }}>
                          {city.status.emoji} {city.status.label}
                        </span>
                      </div>
                      <div className="heatmap-popup-grid">
                        <div className="heatmap-popup-stat">
                          <div className="heatmap-popup-stat-label">AQI</div>
                          <div className="heatmap-popup-stat-value" style={{ color: getColorForValue(city.aqi, 'aqi') }}>{city.aqi}</div>
                        </div>
                        <div className="heatmap-popup-stat">
                          <div className="heatmap-popup-stat-label">PM2.5</div>
                          <div className="heatmap-popup-stat-value" style={{ color: '#3b82f6' }}>{city.pm25}</div>
                        </div>
                        <div className="heatmap-popup-stat">
                          <div className="heatmap-popup-stat-label">PM10</div>
                          <div className="heatmap-popup-stat-value" style={{ color: '#06b6d4' }}>{city.pm10}</div>
                        </div>
                        <div className="heatmap-popup-stat">
                          <div className="heatmap-popup-stat-label">NO₂</div>
                          <div className="heatmap-popup-stat-value" style={{ color: '#f97316' }}>{city.no2}</div>
                        </div>
                      </div>
                      <button
                        className="heatmap-popup-btn"
                        onClick={() => handleDistrictClick(city)}
                      >
                        View Full Analysis →
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* ── Layer Control Panel ── */}
          <div className="absolute top-4 right-4 z-[500]">
            <button
              onClick={() => setLayerPanelOpen(!layerPanelOpen)}
              className="w-10 h-10 rounded-xl bg-[#0a1628]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all hover:border-blue-500/30 shadow-lg"
            >
              <Layers className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {layerPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-12 right-0 w-56 layer-control-panel"
                >
                  <div className="p-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] px-3 pt-3">
                    Map Layers
                  </div>
                  {layerConfig.map(lc => (
                    <button
                      key={lc.key}
                      onClick={() => toggleLayer(lc.key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        layers[lc.key]
                          ? 'text-white bg-white/[0.06]'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: layers[lc.key] ? lc.color + '20' : 'transparent',
                          border: `1px solid ${layers[lc.key] ? lc.color + '40' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        <lc.icon className="w-3.5 h-3.5" style={{ color: layers[lc.key] ? lc.color : undefined }} />
                      </div>
                      {lc.label}
                      <div className={`ml-auto w-8 h-5 rounded-full transition-all ${
                        layers[lc.key] ? 'bg-blue-500' : 'bg-white/10'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all mt-0.5 ${
                          layers[lc.key] ? 'translate-x-3.5' : 'translate-x-0.5'
                        }`} />
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Legend ── */}
          <div className="absolute bottom-4 right-4 z-[500] legend-dock">
            <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Pollution Scale</div>
            <div className="flex items-center gap-1.5">
              {[
                { color: '#22c55e', label: 'G' },
                { color: '#eab308', label: 'M' },
                { color: '#f97316', label: 'U(S)' },
                { color: '#ef4444', label: 'U' },
                { color: '#a855f7', label: 'VU' },
                { color: '#7e0023', label: 'H' },
              ].map(l => (
                <div key={l.label} className="flex flex-col items-center gap-1">
                  <div className="w-6 h-2 rounded-full" style={{ background: l.color, boxShadow: `0 0 8px ${l.color}50` }} />
                  <span className="text-[7px] font-black text-gray-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Error Warning ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-4 left-4 z-[500] glass-card border-amber-500/20 px-4 py-2.5 flex items-center gap-3"
              >
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-bold text-amber-400">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─────── SIDEBAR ─────── */}
        <div className="space-y-4 overflow-y-auto max-h-[700px] custom-scrollbar">
          {/* Pollutant Detail Panel (when district selected) */}
          <AnimatePresence>
            {panelOpen && selectedDistrict && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className="pollutant-detail-panel"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">{selectedDistrict.name}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                      {selectedDistrict.status.emoji} {selectedDistrict.status.label}
                    </p>
                  </div>
                  <button
                    onClick={() => { setPanelOpen(false); setSelectedDistrict(null); }}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* AQI Big Number */}
                <div className="text-center py-4 mb-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05]">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Air Quality Index</div>
                  <div className="text-5xl font-black tracking-tighter" style={{ color: getColorForValue(selectedDistrict.aqi, 'aqi') }}>
                    {selectedDistrict.aqi}
                  </div>
                  <div className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${getAQIGradient(selectedDistrict.aqi)} text-white`}>
                    {selectedDistrict.status.label}
                  </div>
                </div>

                {/* Pollutant Bars */}
                <div className="space-y-3">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Pollutant Breakdown</div>
                  {POLLUTANTS.map((pol, idx) => {
                    const value = selectedDistrict[pol.key] || 0;
                    const pct = Math.min((value / pol.max) * 100, 100);
                    const whoPct = (pol.who / pol.max) * 100;
                    const exceedsWHO = value > pol.who;
                    const Icon = pol.icon;
                    return (
                      <motion.div
                        key={pol.key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="pollutant-bar-card"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: pol.color + '15', border: `1px solid ${pol.color}30` }}>
                              <Icon className="w-3 h-3" style={{ color: pol.color }} />
                            </div>
                            <span className="text-[11px] font-black text-gray-300">{pol.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-black" style={{ color: pol.color }}>{Math.round(value)}</span>
                            <span className="text-[8px] text-gray-600 font-bold">{pol.unit}</span>
                            {exceedsWHO && (
                              <span className="text-[7px] font-black text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
                                ⚠ WHO
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="relative h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.08 }}
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{ background: `linear-gradient(90deg, ${pol.color}80, ${pol.color})` }}
                          />
                          {/* WHO guideline marker */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                            style={{ left: `${whoPct}%` }}
                            title={`WHO Guideline: ${pol.who} ${pol.unit}`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Panel */}
          <div className="glass-card p-5 border-blue-500/10">
            <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-5 flex items-center justify-between">
              <span>Live Intelligence</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </h3>

            {stats ? (
              <div className="space-y-5">
                <div className="text-center py-3">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Delhi Average</div>
                  <div className="text-5xl font-black tracking-tighter" style={{ color: getColorForValue(stats.avg, 'aqi') }}>
                    {stats.avg}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em]">Live Sync</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-red-500/[0.05] border border-red-500/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span className="text-[8px] font-black text-red-500 uppercase tracking-wider">Peak</span>
                    </div>
                    <div className="text-sm font-black text-white truncate">{stats.worst.name}</div>
                    <div className="text-2xl font-black text-red-500 tracking-tighter">{stats.worst.aqi}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingDown className="w-3 h-3 text-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wider">Cleanest</span>
                    </div>
                    <div className="text-sm font-black text-white truncate">{stats.best.name}</div>
                    <div className="text-2xl font-black text-emerald-500 tracking-tighter">{stats.best.aqi}</div>
                  </div>
                </div>

                {/* All stations micro-list */}
                <div>
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">All Stations</div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                    {[...activeData].sort((a, b) => b.aqi - a.aqi).map(d => (
                      <button
                        key={d.name}
                        onClick={() => handleDistrictClick(d)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: getColorForValue(d.aqi, 'aqi'), boxShadow: `0 0 6px ${getColorForValue(d.aqi, 'aqi')}40` }} />
                          <span className="text-[11px] font-bold text-gray-400 group-hover:text-white transition-colors truncate max-w-[140px]">{d.name}</span>
                        </div>
                        <span className="text-[12px] font-black" style={{ color: getColorForValue(d.aqi, 'aqi') }}>{d.aqi}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-600 text-sm">Loading data...</div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ TIME-LAPSE CONTROLS ═══════════ */}
      <AnimatePresence>
        {showTimeLapse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="time-lapse-dock"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-[11px] font-black text-gray-300 uppercase tracking-wider">Time-Lapse</span>
              </div>

              <div className="flex bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.06]">
                {['24h', '7d'].map(r => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                      timeRange === r ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              {historyData.length > 0 && historyData[timeIndex] && (
                <span className="text-[11px] font-bold text-gray-400 ml-auto">
                  {new Date(historyData[timeIndex].timestamp).toLocaleString('en-IN', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="range"
                min={0}
                max={Math.max(historyData.length - 1, 0)}
                value={timeIndex}
                onChange={(e) => { setTimeIndex(parseInt(e.target.value)); setIsPlaying(false); }}
                className="time-slider"
                style={{ width: '100%' }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[8px] font-bold text-gray-600">
                  {historyData.length > 0 ? new Date(historyData[0]?.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit' }) : '—'}
                </span>
                <span className="text-[9px] font-black text-gray-500">{timeIndex + 1} / {historyData.length || 1}</span>
                <span className="text-[8px] font-bold text-gray-600">
                  {historyData.length > 0 ? new Date(historyData[historyData.length - 1]?.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit' }) : '—'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ BOTTOM STATS DOCK ═══════════ */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-dock"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-wider">Avg AQI</div>
                  <div className="text-lg font-black text-white tracking-tighter">{stats.avg}</div>
                </div>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-wider">Worst</div>
                  <div className="text-sm font-black text-red-400 tracking-tight truncate max-w-[120px]">{stats.worst.name} ({stats.worst.aqi})</div>
                </div>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-wider">Best</div>
                  <div className="text-sm font-black text-emerald-400 tracking-tight truncate max-w-[120px]">{stats.best.name} ({stats.best.aqi})</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
                {stats.total} stations • Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DelhiMap;