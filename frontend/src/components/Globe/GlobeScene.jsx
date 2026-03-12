import React, { useRef, useMemo, useState, useCallback, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import * as topojson from 'topojson-client';
import { getAQIColor, ISO3_TO_ISO2, FALLBACK_GLOBAL_AQI, COUNTRY_CENTROIDS } from './globeUtils';

const GLOBE_RADIUS = 2;
const WORLD_JSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Error Boundary for WebGL crashes
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#050a18', color: 'white', flexDirection: 'column', gap: '16px'
        }}>
          <div style={{ fontSize: '48px' }}>🌍</div>
          <div style={{ fontSize: '18px', fontWeight: 600 }}>3D Globe requires WebGL</div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
            Please use a browser with WebGL support enabled
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 24px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Individual Country Mesh
function CountryMesh({ feature, aqiData, onHover, onClick }) {
  const iso3 = feature.id;
  const iso2 = ISO3_TO_ISO2[iso3] || iso3;
  const countryData = aqiData[iso2];
  const aqi = countryData?.aqi;
  const color = getAQIColor(aqi);
  const [hovered, setHovered] = useState(false);

  const meshGeometry = useMemo(() => {
    if (!feature.geometry) return null;

    const allPositions = [];
    const getPolygonVertices = (coordinates) => {
      const verts = [];
      coordinates[0].forEach(([lng, lat]) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const r = GLOBE_RADIUS + 0.012;
        const x = -(r) * Math.sin(phi) * Math.cos(theta);
        const y = (r) * Math.cos(phi);
        const z = (r) * Math.sin(phi) * Math.sin(theta);
        verts.push(x, y, z);
      });
      return verts;
    };

    const processPolygon = (coordinates) => {
      const v = getPolygonVertices(coordinates);
      for (let i = 3; i < v.length - 3; i += 3) {
        allPositions.push(v[0], v[1], v[2]);
        allPositions.push(v[i], v[i+1], v[i+2]);
        if (i + 3 < v.length) {
          allPositions.push(v[i+3], v[i+4], v[i+5]);
        } else {
          allPositions.push(v[0], v[1], v[2]);
        }
      }
    };

    if (feature.geometry.type === 'Polygon') {
      processPolygon(feature.geometry.coordinates);
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach(polygon => processPolygon(polygon));
    }

    if (allPositions.length === 0) return null;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3));
    geometry.computeVertexNormals();
    return geometry;
  }, [feature]);

  const countryName = feature.properties?.name || iso3;

  if (!meshGeometry) return null;

  return (
    <mesh
      geometry={meshGeometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover({ name: countryName, code: iso2, aqi, ...countryData });
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick({ name: countryName, code: iso2, aqi, ...countryData });
      }}
    >
      <meshPhongMaterial
        color={color}
        transparent
        opacity={hovered ? 0.95 : 0.75}
        side={THREE.DoubleSide}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.4 : 0}
      />
    </mesh>
  );
}

// Country borders as lines
function CountryBorders({ features }) {
  const lineGeometry = useMemo(() => {
    const positions = [];

    features.forEach(feature => {
      if (!feature.geometry) return;

      const processRing = (ring) => {
        for (let i = 0; i < ring.length - 1; i++) {
          const [lng1, lat1] = ring[i];
          const [lng2, lat2] = ring[i + 1];

          const phi1 = (90 - lat1) * (Math.PI / 180);
          const theta1 = (lng1 + 180) * (Math.PI / 180);
          const phi2 = (90 - lat2) * (Math.PI / 180);
          const theta2 = (lng2 + 180) * (Math.PI / 180);

          const r = GLOBE_RADIUS + 0.016;

          positions.push(
            -(r) * Math.sin(phi1) * Math.cos(theta1),
            (r) * Math.cos(phi1),
            (r) * Math.sin(phi1) * Math.sin(theta1),
            -(r) * Math.sin(phi2) * Math.cos(theta2),
            (r) * Math.cos(phi2),
            (r) * Math.sin(phi2) * Math.sin(theta2),
          );
        }
      };

      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach(processRing);
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => polygon.forEach(processRing));
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [features]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.18} />
    </lineSegments>
  );
}

// AQI Marker dots
function AQIMarkers({ aqiData }) {
  const markers = useMemo(() => {
    return Object.entries(aqiData).map(([code, data]) => {
      const centroid = COUNTRY_CENTROIDS[code];
      if (!centroid) return null;

      const phi = (90 - centroid.lat) * (Math.PI / 180);
      const theta = (centroid.lng + 180) * (Math.PI / 180);
      const r = GLOBE_RADIUS + 0.04;
      const x = -(r) * Math.sin(phi) * Math.cos(theta);
      const y = (r) * Math.cos(phi);
      const z = (r) * Math.sin(phi) * Math.sin(theta);

      return { code, x, y, z, color: getAQIColor(data.aqi), aqi: data.aqi };
    }).filter(Boolean);
  }, [aqiData]);

  return (
    <group>
      {markers.map(marker => (
        <mesh key={marker.code} position={[marker.x, marker.y, marker.z]}>
          <sphereGeometry args={[0.028, 8, 8]} />
          <meshBasicMaterial color={marker.color} />
        </mesh>
      ))}
    </group>
  );
}

// Atmosphere glow
function Atmosphere() {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
  }, []);

  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// Main Globe group
function Globe({ aqiData, onHoverCountry, onClickCountry }) {
  const globeRef = useRef();
  const [worldData, setWorldData] = useState(null);

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05;
    }
  });

  useEffect(() => {
    fetch(WORLD_JSON_URL)
      .then(res => res.json())
      .then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        setWorldData(countries);
      })
      .catch(err => console.error('Failed to load world data:', err));
  }, []);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(0.3, '#0d1f3c');
    gradient.addColorStop(0.5, '#0f2847');
    gradient.addColorStop(0.7, '#0d1f3c');
    gradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(30, 60, 110, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 64) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 64) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={globeRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          transparent
          opacity={0.95}
          specular={new THREE.Color('#1a3a5c')}
          shininess={15}
        />
      </mesh>

      {worldData && worldData.features.map((feature, i) => (
        <CountryMesh
          key={feature.id || i}
          feature={feature}
          aqiData={aqiData}
          onHover={onHoverCountry}
          onClick={onClickCountry}
        />
      ))}

      {worldData && <CountryBorders features={worldData.features} />}

      <AQIMarkers aqiData={aqiData} />
      <Atmosphere />
    </group>
  );
}

// Tooltip overlay
function Tooltip({ country }) {
  if (!country) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(10, 15, 30, 0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: '12px',
      padding: '12px 20px',
      color: 'white',
      fontSize: '14px',
      pointerEvents: 'none',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        width: '14px', height: '14px', borderRadius: '50%',
        backgroundColor: getAQIColor(country.aqi),
        boxShadow: `0 0 10px ${getAQIColor(country.aqi)}`,
      }} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '15px' }}>{country.name}</div>
        <div style={{ opacity: 0.7, fontSize: '12px' }}>
          AQI: <span style={{ color: getAQIColor(country.aqi), fontWeight: 600 }}>
            {country.aqi ?? 'N/A'}
          </span>
          {country.city && <span> • {country.city}</span>}
        </div>
      </div>
    </div>
  );
}

// Main exported component
export default function GlobeScene({ aqiData = FALLBACK_GLOBAL_AQI, onSelectCountry }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const handleHover = useCallback((country) => {
    setHoveredCountry(country);
  }, []);

  const handleClick = useCallback((country) => {
    if (onSelectCountry) onSelectCountry(country);
  }, [onSelectCountry]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#050a18' }}>
      <Tooltip country={hoveredCountry} />
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#050a18', 1);
          }}
          style={{ background: '#050a18' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 3, 5]} intensity={1.0} color="#ffffff" />
          <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#4488ff" />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#88aaff" />

          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <Globe
            aqiData={aqiData}
            onHoverCountry={handleHover}
            onClickCountry={handleClick}
          />

          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3.5}
            maxDistance={10}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
