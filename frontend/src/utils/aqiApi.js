// For real API integration (example using OpenAQ or AirVisual API)
const API_KEY = eea48433f169fc82590680e20281052c; // Get from https://www.iqair.com/ or https://openaq.org/

export const fetchAQIData = async (city) => {
  try {
    // Example using AirVisual API
    const response = await fetch(
      `https://api.airvisual.com/v2/city?city=${encodeURIComponent(city)}&state=state&country=USA&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch AQI data');
    }
    
    const data = await response.json();
    return {
      aqi: data.data.current.pollution.aqius,
      pm25: data.data.current.pollution.mainus,
      temperature: data.data.current.weather.tp,
      humidity: data.data.current.weather.hu,
      windSpeed: data.data.current.weather.ws,
      lastUpdated: new Date().toLocaleTimeString(),
      city: city
    };
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to mock data
    return getMockData(city);
  }
};

const getMockData = (city) => {
  return {
    aqi: Math.floor(Math.random() * 300) + 20,
    pm25: Math.floor(Math.random() * 200) + 10,
    pm10: Math.floor(Math.random() * 200) + 10,
    no2: Math.floor(Math.random() * 100) + 5,
    so2: Math.floor(Math.random() * 50) + 2,
    co: (Math.random() * 5 + 0.5).toFixed(1),
    o3: Math.floor(Math.random() * 100) + 10,
    temperature: Math.floor(Math.random() * 20) + 15,
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: (Math.random() * 10 + 2).toFixed(1),
    lastUpdated: new Date().toLocaleTimeString(),
    city: city
  };
};

// Alternative free APIs:
// 1. OpenAQ: https://docs.openaq.org/
// 2. WAQI: https://aqicn.org/api/
// 3. BreezoMeter: https://www.breezometer.com/products/air-quality-api

export const getAQICategory = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: '#009966' };
  if (aqi <= 100) return { level: 'Moderate', color: '#ffde33' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#ff9933' };
  if (aqi <= 200) return { level: 'Unhealthy', color: '#cc0033' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#660099' };
  return { level: 'Hazardous', color: '#7e0023' };
};