const cron = require('node-cron');
const axios = require('axios');
const AQIData = require('../models/AQIData');

// Delhi districts with their coordinates
const delhiDistricts = [
  { name: 'Central Delhi', lat: 28.6358, lon: 77.2245 },
  { name: 'North Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'South Delhi', lat: 28.5355, lon: 77.2500 },
  { name: 'East Delhi', lat: 28.6692, lon: 77.3154 },
  { name: 'West Delhi', lat: 28.6562, lon: 77.1000 },
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'North East Delhi', lat: 28.7154, lon: 77.2842 },
  { name: 'North West Delhi', lat: 28.7272, lon: 77.0688 },
  { name: 'South East Delhi', lat: 28.5562, lon: 77.2760 },
  { name: 'South West Delhi', lat: 28.5820, lon: 77.0707 },
  { name: 'Shahdara', lat: 28.6714, lon: 77.2862 }
];

// Function to get AQI category and color
const getAQICategory = (aqi) => {
  if (aqi <= 50) return { category: 'Good', color: '#00e400' };
  if (aqi <= 100) return { category: 'Moderate', color: '#ffff00' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: '#ff7e00' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97' };
  return { category: 'Hazardous', color: '#7e0023' };
};

// Convert OpenWeatherMap AQI (1-5) to US AQI (0-500)
const convertToUSAQI = (components) => {
  // PM2.5 is the most important pollutant for AQI calculation
  const pm25 = components.pm2_5;
  
  // Breakpoints for PM2.5 (µg/m³) to AQI conversion
  const breakpoints = [
    { cLow: 0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 }
  ];

  let aqi = 0;
  for (let bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      aqi = ((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.aqiLow;
      break;
    }
  }

  return Math.round(aqi);
};

// Fetch AQI data for a district
const fetchDistrictAQI = async (district) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/air_pollution', {
      params: {
        lat: district.lat,
        lon: district.lon,
        appid: process.env.OPENWEATHER_API_KEY
      }
    });

    const data = response.data.list[0];
    const components = data.components;
    
    // Convert to US AQI
    const aqi = convertToUSAQI(components);
    const { category, color } = getAQICategory(aqi);

    return {
      district: district.name,
      aqi: aqi,
      category: category,
      color: color,
      pollutants: {
        pm25: components.pm2_5,
        pm10: components.pm10,
        no2: components.no2,
        o3: components.o3,
        so2: components.so2,
        co: components.co
      },
      timestamp: new Date()
    };
  } catch (error) {
    console.error(`Error fetching AQI for ${district.name}:`, error.message);
    return null;
  }
};

// Main function to fetch and store AQI data
const fetchAndStoreAQI = async () => {
  try {
    console.log('Fetching AQI data for all districts...');
    
    const promises = delhiDistricts.map(district => fetchDistrictAQI(district));
    const results = await Promise.all(promises);
    
    // Filter out null results and save to database
    const validResults = results.filter(result => result !== null);
    
    if (validResults.length > 0) {
      await AQIData.insertMany(validResults);
      console.log(`✅ Successfully stored AQI data for ${validResults.length} districts`);
    } else {
      console.log('❌ No valid AQI data to store');
    }
  } catch (error) {
    console.error('Error fetching AQI data:', error);
  }
};

// Schedule to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled AQI fetch...');
  fetchAndStoreAQI();
});

// Run immediately on startup
fetchAndStoreAQI();

console.log('AQI fetch scheduler started (runs hourly)');

module.exports = { fetchAndStoreAQI };