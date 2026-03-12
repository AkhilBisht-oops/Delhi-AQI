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

// Country centroids for placing markers on globe
export const COUNTRY_CENTROIDS = {
  US: { lat: 39.8, lng: -98.6, name: 'United States' },
  CN: { lat: 35.0, lng: 105.0, name: 'China' },
  IN: { lat: 20.6, lng: 78.9, name: 'India' },
  BR: { lat: -14.2, lng: -51.9, name: 'Brazil' },
  RU: { lat: 61.5, lng: 105.3, name: 'Russia' },
  GB: { lat: 55.4, lng: -3.4, name: 'United Kingdom' },
  FR: { lat: 46.2, lng: 2.2, name: 'France' },
  DE: { lat: 51.2, lng: 10.5, name: 'Germany' },
  JP: { lat: 36.2, lng: 138.3, name: 'Japan' },
  AU: { lat: -25.3, lng: 133.8, name: 'Australia' },
  CA: { lat: 56.1, lng: -106.3, name: 'Canada' },
  IT: { lat: 41.9, lng: 12.6, name: 'Italy' },
  ES: { lat: 40.5, lng: -3.7, name: 'Spain' },
  MX: { lat: 23.6, lng: -102.6, name: 'Mexico' },
  KR: { lat: 35.9, lng: 127.8, name: 'South Korea' },
  ID: { lat: -0.8, lng: 113.9, name: 'Indonesia' },
  TR: { lat: 39.0, lng: 35.2, name: 'Turkey' },
  SA: { lat: 24.0, lng: 45.1, name: 'Saudi Arabia' },
  ZA: { lat: -30.6, lng: 22.9, name: 'South Africa' },
  AR: { lat: -38.4, lng: -63.6, name: 'Argentina' },
  EG: { lat: 26.8, lng: 30.8, name: 'Egypt' },
  NG: { lat: 9.1, lng: 8.7, name: 'Nigeria' },
  PK: { lat: 30.4, lng: 69.3, name: 'Pakistan' },
  BD: { lat: 23.7, lng: 90.4, name: 'Bangladesh' },
  TH: { lat: 15.9, lng: 100.5, name: 'Thailand' },
  VN: { lat: 14.1, lng: 108.3, name: 'Vietnam' },
  PH: { lat: 12.9, lng: 121.8, name: 'Philippines' },
  MY: { lat: 4.2, lng: 101.0, name: 'Malaysia' },
  PL: { lat: 51.9, lng: 19.1, name: 'Poland' },
  UA: { lat: 48.4, lng: 31.2, name: 'Ukraine' },
  NL: { lat: 52.1, lng: 5.3, name: 'Netherlands' },
  SE: { lat: 60.1, lng: 18.6, name: 'Sweden' },
  NO: { lat: 60.5, lng: 8.5, name: 'Norway' },
  CH: { lat: 46.8, lng: 8.2, name: 'Switzerland' },
  AT: { lat: 47.5, lng: 14.6, name: 'Austria' },
  BE: { lat: 50.5, lng: 4.5, name: 'Belgium' },
  CL: { lat: -35.7, lng: -71.5, name: 'Chile' },
  CO: { lat: 4.6, lng: -74.3, name: 'Colombia' },
  PE: { lat: -9.2, lng: -75.0, name: 'Peru' },
  IR: { lat: 32.4, lng: 53.7, name: 'Iran' },
  IQ: { lat: 33.2, lng: 43.7, name: 'Iraq' },
  AE: { lat: 23.4, lng: 53.8, name: 'UAE' },
  IL: { lat: 31.0, lng: 34.9, name: 'Israel' },
  KE: { lat: -0.0, lng: 37.9, name: 'Kenya' },
  ET: { lat: 9.1, lng: 40.5, name: 'Ethiopia' },
  GH: { lat: 7.9, lng: -1.0, name: 'Ghana' },
  TZ: { lat: -6.4, lng: 34.9, name: 'Tanzania' },
  NZ: { lat: -40.9, lng: 174.9, name: 'New Zealand' },
  PT: { lat: 39.4, lng: -8.2, name: 'Portugal' },
  GR: { lat: 39.1, lng: 21.8, name: 'Greece' },
  CZ: { lat: 49.8, lng: 15.5, name: 'Czech Republic' },
  RO: { lat: 45.9, lng: 25.0, name: 'Romania' },
  HU: { lat: 47.2, lng: 19.5, name: 'Hungary' },
  FI: { lat: 61.9, lng: 25.7, name: 'Finland' },
  DK: { lat: 56.3, lng: 9.5, name: 'Denmark' },
  IE: { lat: 53.1, lng: -7.7, name: 'Ireland' },
  SG: { lat: 1.4, lng: 103.8, name: 'Singapore' },
  NP: { lat: 28.4, lng: 84.1, name: 'Nepal' },
  LK: { lat: 7.9, lng: 80.8, name: 'Sri Lanka' },
  MM: { lat: 21.9, lng: 95.9, name: 'Myanmar' },
  KH: { lat: 12.6, lng: 105.0, name: 'Cambodia' },
  QA: { lat: 25.4, lng: 51.2, name: 'Qatar' },
  KW: { lat: 29.3, lng: 47.5, name: 'Kuwait' },
  MA: { lat: 31.8, lng: -7.1, name: 'Morocco' },
  DZ: { lat: 28.0, lng: 1.7, name: 'Algeria' },
};

// Comprehensive fallback AQI data for all countries
export const FALLBACK_GLOBAL_AQI = {
  US: { aqi: 42, city: 'Washington DC' },
  CN: { aqi: 156, city: 'Beijing' },
  IN: { aqi: 198, city: 'Delhi' },
  BR: { aqi: 65, city: 'São Paulo' },
  RU: { aqi: 78, city: 'Moscow' },
  GB: { aqi: 35, city: 'London' },
  FR: { aqi: 48, city: 'Paris' },
  DE: { aqi: 41, city: 'Berlin' },
  JP: { aqi: 52, city: 'Tokyo' },
  AU: { aqi: 28, city: 'Sydney' },
  CA: { aqi: 32, city: 'Toronto' },
  IT: { aqi: 62, city: 'Rome' },
  ES: { aqi: 45, city: 'Madrid' },
  MX: { aqi: 89, city: 'Mexico City' },
  KR: { aqi: 75, city: 'Seoul' },
  ID: { aqi: 112, city: 'Jakarta' },
  TR: { aqi: 88, city: 'Istanbul' },
  SA: { aqi: 134, city: 'Riyadh' },
  ZA: { aqi: 67, city: 'Johannesburg' },
  AR: { aqi: 55, city: 'Buenos Aires' },
  EG: { aqi: 145, city: 'Cairo' },
  NG: { aqi: 155, city: 'Lagos' },
  PK: { aqi: 210, city: 'Lahore' },
  BD: { aqi: 195, city: 'Dhaka' },
  TH: { aqi: 98, city: 'Bangkok' },
  VN: { aqi: 105, city: 'Hanoi' },
  PH: { aqi: 82, city: 'Manila' },
  MY: { aqi: 76, city: 'Kuala Lumpur' },
  PL: { aqi: 71, city: 'Warsaw' },
  UA: { aqi: 68, city: 'Kyiv' },
  NL: { aqi: 38, city: 'Amsterdam' },
  SE: { aqi: 22, city: 'Stockholm' },
  NO: { aqi: 18, city: 'Oslo' },
  CH: { aqi: 30, city: 'Zurich' },
  AT: { aqi: 36, city: 'Vienna' },
  BE: { aqi: 44, city: 'Brussels' },
  CL: { aqi: 58, city: 'Santiago' },
  CO: { aqi: 72, city: 'Bogotá' },
  PE: { aqi: 85, city: 'Lima' },
  IR: { aqi: 162, city: 'Tehran' },
  IQ: { aqi: 175, city: 'Baghdad' },
  AE: { aqi: 118, city: 'Dubai' },
  IL: { aqi: 55, city: 'Tel Aviv' },
  KE: { aqi: 78, city: 'Nairobi' },
  ET: { aqi: 95, city: 'Addis Ababa' },
  GH: { aqi: 88, city: 'Accra' },
  TZ: { aqi: 72, city: 'Dar es Salaam' },
  NZ: { aqi: 15, city: 'Auckland' },
  PT: { aqi: 34, city: 'Lisbon' },
  GR: { aqi: 52, city: 'Athens' },
  CZ: { aqi: 56, city: 'Prague' },
  RO: { aqi: 65, city: 'Bucharest' },
  HU: { aqi: 58, city: 'Budapest' },
  FI: { aqi: 16, city: 'Helsinki' },
  DK: { aqi: 25, city: 'Copenhagen' },
  IE: { aqi: 22, city: 'Dublin' },
  SG: { aqi: 55, city: 'Singapore' },
  NP: { aqi: 178, city: 'Kathmandu' },
  LK: { aqi: 85, city: 'Colombo' },
  MM: { aqi: 130, city: 'Yangon' },
  KH: { aqi: 110, city: 'Phnom Penh' },
  QA: { aqi: 105, city: 'Doha' },
  KW: { aqi: 125, city: 'Kuwait City' },
  MA: { aqi: 68, city: 'Casablanca' },
  DZ: { aqi: 85, city: 'Algiers' },
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
