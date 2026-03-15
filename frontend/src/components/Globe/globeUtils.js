// AQI Color mapping based on US EPA standards
// Good (0-50): Green, Moderate (51-100): Yellow, 
// Unhealthy for Sensitive (101-150): Orange, Unhealthy (151-200): Red,
// Very Unhealthy (201-300): Purple, Hazardous (301+): Maroon

export const getAQIColor = (aqi) => {
  if (aqi === null || aqi === undefined) return '#444444'; // No data
  if (aqi <= 50) return '#00e400';    // Good - Green
  if (aqi <= 100) return '#ffff00';   // Moderate - Yellow
  if (aqi <= 150) return '#ff7e00';   // Unhealthy for Sensitive - Orange
  if (aqi <= 200) return '#ff0000';   // Unhealthy - Red
  if (aqi <= 300) return '#8f3f97';   // Very Unhealthy - Purple
  return '#7e0023';                    // Hazardous - Maroon
};

export const getAQICategory = (aqi) => {
  if (aqi === null || aqi === undefined) return 'No Data';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const getAQIEmoji = (aqi) => {
  if (aqi === null || aqi === undefined) return '❓';
  if (aqi <= 50) return '😊';
  if (aqi <= 100) return '🙂';
  if (aqi <= 150) return '😷';
  if (aqi <= 200) return '😨';
  if (aqi <= 300) return '🤢';
  return '☠️';
};

// Convert lat/lng to 3D sphere position
export const latLngToVector3 = (lat, lng, radius = 1.01) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
};

// AQI Legend data
export const AQI_LEGEND = [
  { range: '0-50', label: 'Good', color: '#00e400', description: 'Air quality is satisfactory' },
  { range: '51-100', label: 'Moderate', color: '#ffff00', description: 'Acceptable quality' },
  { range: '101-150', label: 'Unhealthy (Sensitive)', color: '#ff7e00', description: 'Sensitive groups affected' },
  { range: '151-200', label: 'Unhealthy', color: '#ff0000', description: 'Everyone may feel effects' },
  { range: '201-300', label: 'Very Unhealthy', color: '#8f3f97', description: 'Health alert' },
  { range: '301+', label: 'Hazardous', color: '#7e0023', description: 'Emergency conditions' },
];

export const COUNTRY_CENTROIDS = {
  'Central Delhi': { lat: 28.6358, lng: 77.2245, name: 'Central Delhi' },
  'North Delhi': { lat: 28.7041, lng: 77.1025, name: 'North Delhi' },
  'South Delhi': { lat: 28.5355, lng: 77.2500, name: 'South Delhi' },
  'East Delhi': { lat: 28.6692, lng: 77.3154, name: 'East Delhi' },
  'West Delhi': { lat: 28.6562, lng: 77.1000, name: 'West Delhi' },
  'New Delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi' },
  'North East Delhi': { lat: 28.7154, lng: 77.2842, name: 'North East Delhi' },
  'North West Delhi': { lat: 28.7272, lng: 77.0688, name: 'North West Delhi' },
  'South East Delhi': { lat: 28.5562, lng: 77.2760, name: 'South East Delhi' },
  'South West Delhi': { lat: 28.5820, lng: 77.0707, name: 'South West Delhi' },
  'Shahdara': { lat: 28.6714, lng: 77.2862, name: 'Shahdara' }
};

export const FALLBACK_GLOBAL_AQI = {
  'Central Delhi': { aqi: 180, district: 'Central Delhi' },
  'North Delhi': { aqi: 190, district: 'North Delhi' },
  'South Delhi': { aqi: 150, district: 'South Delhi' },
  'East Delhi': { aqi: 220, district: 'East Delhi' },
  'West Delhi': { aqi: 195, district: 'West Delhi' },
  'New Delhi': { aqi: 160, district: 'New Delhi' },
  'North East Delhi': { aqi: 240, district: 'North East Delhi' },
  'North West Delhi': { aqi: 200, district: 'North West Delhi' },
  'South East Delhi': { aqi: 175, district: 'South East Delhi' },
  'South West Delhi': { aqi: 185, district: 'South West Delhi' },
  'Shahdara': { aqi: 250, district: 'Shahdara' }
};

// ISO Alpha-3 to Alpha-2 country code mapping (for TopoJSON compatibility)
export const ISO3_TO_ISO2 = {
  AFG: 'AF', ALB: 'AL', DZA: 'DZ', AGO: 'AO', ARG: 'AR',
  ARM: 'AM', AUS: 'AU', AUT: 'AT', AZE: 'AZ', BHS: 'BS',
  BGD: 'BD', BLR: 'BY', BEL: 'BE', BLZ: 'BZ', BEN: 'BJ',
  BTN: 'BT', BOL: 'BO', BIH: 'BA', BWA: 'BW', BRA: 'BR',
  BRN: 'BN', BGR: 'BG', BFA: 'BF', BDI: 'BI', KHM: 'KH',
  CMR: 'CM', CAN: 'CA', CAF: 'CF', TCD: 'TD', CHL: 'CL',
  CHN: 'CN', COL: 'CO', COG: 'CG', COD: 'CD', CRI: 'CR',
  CIV: 'CI', HRV: 'HR', CUB: 'CU', CYP: 'CY', CZE: 'CZ',
  DNK: 'DK', DJI: 'DJ', DOM: 'DO', ECU: 'EC', EGY: 'EG',
  SLV: 'SV', GNQ: 'GQ', ERI: 'ER', EST: 'EE', ETH: 'ET',
  FLK: 'FK', FJI: 'FJ', FIN: 'FI', FRA: 'FR', GUF: 'GF',
  GAB: 'GA', GMB: 'GM', GEO: 'GE', DEU: 'DE', GHA: 'GH',
  GRC: 'GR', GRL: 'GL', GTM: 'GT', GIN: 'GN', GNB: 'GW',
  GUY: 'GY', HTI: 'HT', HND: 'HN', HUN: 'HU', ISL: 'IS',
  IND: 'IN', IDN: 'ID', IRN: 'IR', IRQ: 'IQ', IRL: 'IE',
  ISR: 'IL', ITA: 'IT', JAM: 'JM', JPN: 'JP', JOR: 'JO',
  KAZ: 'KZ', KEN: 'KE', PRK: 'KP', KOR: 'KR', KOS: 'XK',
  KWT: 'KW', KGZ: 'KG', LAO: 'LA', LVA: 'LV', LBN: 'LB',
  LSO: 'LS', LBR: 'LR', LBY: 'LY', LTU: 'LT', LUX: 'LU',
  MKD: 'MK', MDG: 'MG', MWI: 'MW', MYS: 'MY', MLI: 'ML',
  MRT: 'MR', MEX: 'MX', MDA: 'MD', MNG: 'MN', MNE: 'ME',
  MAR: 'MA', MOZ: 'MZ', MMR: 'MM', NAM: 'NA', NPL: 'NP',
  NLD: 'NL', NCL: 'NC', NZL: 'NZ', NIC: 'NI', NER: 'NE',
  NGA: 'NG', NOR: 'NO', OMN: 'OM', PAK: 'PK', PSE: 'PS',
  PAN: 'PA', PNG: 'PG', PRY: 'PY', PER: 'PE', PHL: 'PH',
  POL: 'PL', PRT: 'PT', PRI: 'PR', QAT: 'QA', ROU: 'RO',
  RUS: 'RU', RWA: 'RW', SAU: 'SA', SEN: 'SN', SRB: 'RS',
  SLE: 'SL', SVK: 'SK', SVN: 'SI', SLB: 'SB', SOM: 'SO',
  ZAF: 'ZA', SSD: 'SS', ESP: 'ES', LKA: 'LK', SDN: 'SD',
  SUR: 'SR', SWZ: 'SZ', SWE: 'SE', CHE: 'CH', SYR: 'SY',
  TWN: 'TW', TJK: 'TJ', TZA: 'TZ', THA: 'TH', TLS: 'TL',
  TGO: 'TG', TTO: 'TT', TUN: 'TN', TUR: 'TR', TKM: 'TM',
  UGA: 'UG', UKR: 'UA',  ARE: 'AE', GBR: 'GB', USA: 'US',
  URY: 'UY', UZB: 'UZ', VUT: 'VU', VEN: 'VE', VNM: 'VN',
  ESH: 'EH', YEM: 'YE', ZMB: 'ZM', ZWE: 'ZW', SGP: 'SG',
  // Numeric codes (TopoJSON 110m compatible)
  356: 'IN', 840: 'US', 156: 'CN', 76: 'BR', 643: 'RU', 
  826: 'GB', 250: 'FR', 276: 'DE', 392: 'JP', 36: 'AU', 
  124: 'CA', 380: 'IT', 724: 'ES', 484: 'MX', 410: 'KR', 
  360: 'ID', 792: 'TR', 682: 'SA', 710: 'ZA', 32: 'AR', 
  818: 'EG', 566: 'NG', 586: 'PK', 50: 'BD', 764: 'TH', 
  704: 'VN', 608: 'PH', 458: 'MY', 616: 'PL', 804: 'UA', 
  528: 'NL', 752: 'SE', 578: 'NO', 756: 'CH', 40: 'AT', 
  56: 'BE', 152: 'CL', 170: 'CO', 604: 'PE', 364: 'IR', 
  368: 'IQ', 784: 'AE', 376: 'IL', 404: 'KE', 231: 'ET', 
  288: 'GH', 834: 'TZ', 554: 'NZ', 620: 'PT', 300: 'GR', 
  203: 'CZ', 642: 'RO', 348: 'HU', 246: 'FI', 208: 'DK', 
  372: 'IE', 702: 'SG', 524: 'NP', 144: 'LK', 104: 'MM', 
  116: 'KH', 634: 'QA', 414: 'KW', 504: 'MA', 12: 'DZ'
};

// Country name mapping for display
export const COUNTRY_NAMES = {};
Object.entries(COUNTRY_CENTROIDS).forEach(([code, data]) => {
  COUNTRY_NAMES[code] = data.name;
});
