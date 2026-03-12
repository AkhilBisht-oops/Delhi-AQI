const express = require('express');
const router = express.Router();
const AQIData = require('../models/AQIData');

// @route   GET /api/aqi/latest
// @desc    Get latest AQI data for all districts
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    // Get the latest AQI data for each district
    const latestData = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          aqi: { $first: '$aqi' },
          category: { $first: '$category' },
          color: { $first: '$color' },
          pollutants: { $first: '$pollutants' },
          timestamp: { $first: '$timestamp' }
        }
      },
      {
        $project: {
          _id: 1,
          district: '$_id',
          aqi: 1,
          category: 1,
          color: 1,
          pollutants: 1,
          timestamp: 1
        }
      },
      {
        $sort: { aqi: -1 }
      }
    ]);

    res.json(latestData);

  } catch (error) {
    console.error('Error fetching latest AQI:', error);
    res.status(500).json({ 
      error: 'Failed to fetch AQI data',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/district/:districtName
// @desc    Get latest AQI data for a specific district
// @access  Public
router.get('/district/:districtName', async (req, res) => {
  try {
    const { districtName } = req.params;

    const data = await AQIData.findOne({ 
      district: districtName 
    }).sort({ timestamp: -1 });

    if (!data) {
      return res.status(404).json({ 
        error: 'No data found for this district' 
      });
    }

    res.json(data);

  } catch (error) {
    console.error('Error fetching district AQI:', error);
    res.status(500).json({ 
      error: 'Failed to fetch district data',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/history
// @desc    Get historical AQI data for a district
// @access  Public
router.get('/history', async (req, res) => {
  try {
    const { district, days = 7 } = req.query;

    if (!district) {
      return res.status(400).json({ 
        error: 'District name is required' 
      });
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const historicalData = await AQIData.find({
      district: district,
      timestamp: { $gte: daysAgo }
    }).sort({ timestamp: 1 });

    res.json({
      district,
      days: parseInt(days),
      dataPoints: historicalData.length,
      data: historicalData
    });

  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch historical data',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/districts
// @desc    Get list of all districts
// @access  Public
router.get('/districts', async (req, res) => {
  try {
    const districts = await AQIData.distinct('district');
    res.json({ districts });

  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch districts',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/summary
// @desc    Get summary statistics of AQI data
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const summary = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          latestAQI: { $first: '$aqi' },
          category: { $first: '$category' }
        }
      },
      {
        $group: {
          _id: null,
          totalDistricts: { $sum: 1 },
          averageAQI: { $avg: '$latestAQI' },
          maxAQI: { $max: '$latestAQI' },
          minAQI: { $min: '$latestAQI' },
          categoryBreakdown: {
            $push: {
              district: '$_id',
              aqi: '$latestAQI',
              category: '$category'
            }
          }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.json({
        message: 'No AQI data available yet',
        totalDistricts: 0
      });
    }

    res.json(summary[0]);

  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ 
      error: 'Failed to fetch summary',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/worst
// @desc    Get districts with worst air quality
// @access  Public
router.get('/worst', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const worstDistricts = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          aqi: { $first: '$aqi' },
          category: { $first: '$category' },
          color: { $first: '$color' },
          pollutants: { $first: '$pollutants' },
          timestamp: { $first: '$timestamp' }
        }
      },
      {
        $sort: { aqi: -1 }
      },
      {
        $limit: limit
      }
    ]);

    res.json(worstDistricts);

  } catch (error) {
    console.error('Error fetching worst districts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch worst districts',
      details: error.message 
    });
  }
});

// @route   GET /api/aqi/global
// @desc    Get global AQI data for world map
// @access  Public
router.get('/global', async (req, res) => {
  try {
    const axios = require('axios');
    
    // Comprehensive list of cities covering all major countries
    const worldCities = [
      // Asia
      { city: 'Delhi', country: 'IN', lat: 28.61, lng: 77.23 },
      { city: 'Beijing', country: 'CN', lat: 39.91, lng: 116.40 },
      { city: 'Tokyo', country: 'JP', lat: 35.68, lng: 139.69 },
      { city: 'Seoul', country: 'KR', lat: 37.57, lng: 126.98 },
      { city: 'Jakarta', country: 'ID', lat: -6.21, lng: 106.85 },
      { city: 'Bangkok', country: 'TH', lat: 13.76, lng: 100.50 },
      { city: 'Lahore', country: 'PK', lat: 31.55, lng: 74.35 },
      { city: 'Dhaka', country: 'BD', lat: 23.81, lng: 90.41 },
      { city: 'Hanoi', country: 'VN', lat: 21.03, lng: 105.85 },
      { city: 'Manila', country: 'PH', lat: 14.60, lng: 120.98 },
      { city: 'Kuala Lumpur', country: 'MY', lat: 3.14, lng: 101.69 },
      { city: 'Singapore', country: 'SG', lat: 1.35, lng: 103.82 },
      { city: 'Kathmandu', country: 'NP', lat: 27.72, lng: 85.32 },
      { city: 'Colombo', country: 'LK', lat: 6.93, lng: 79.84 },
      { city: 'Yangon', country: 'MM', lat: 16.87, lng: 96.20 },
      { city: 'Phnom Penh', country: 'KH', lat: 11.56, lng: 104.92 },
      // Middle East
      { city: 'Riyadh', country: 'SA', lat: 24.69, lng: 46.72 },
      { city: 'Tehran', country: 'IR', lat: 35.69, lng: 51.39 },
      { city: 'Baghdad', country: 'IQ', lat: 33.31, lng: 44.37 },
      { city: 'Dubai', country: 'AE', lat: 25.20, lng: 55.27 },
      { city: 'Istanbul', country: 'TR', lat: 41.01, lng: 28.98 },
      { city: 'Tel Aviv', country: 'IL', lat: 32.07, lng: 34.78 },
      { city: 'Doha', country: 'QA', lat: 25.29, lng: 51.53 },
      { city: 'Kuwait City', country: 'KW', lat: 29.38, lng: 47.99 },
      // Europe
      { city: 'London', country: 'GB', lat: 51.51, lng: -0.13 },
      { city: 'Paris', country: 'FR', lat: 48.86, lng: 2.35 },
      { city: 'Berlin', country: 'DE', lat: 52.52, lng: 13.41 },
      { city: 'Moscow', country: 'RU', lat: 55.76, lng: 37.62 },
      { city: 'Rome', country: 'IT', lat: 41.90, lng: 12.50 },
      { city: 'Madrid', country: 'ES', lat: 40.42, lng: -3.70 },
      { city: 'Warsaw', country: 'PL', lat: 52.23, lng: 21.01 },
      { city: 'Amsterdam', country: 'NL', lat: 52.37, lng: 4.90 },
      { city: 'Stockholm', country: 'SE', lat: 59.33, lng: 18.07 },
      { city: 'Oslo', country: 'NO', lat: 59.91, lng: 10.75 },
      { city: 'Kyiv', country: 'UA', lat: 50.45, lng: 30.52 },
      { city: 'Lisbon', country: 'PT', lat: 38.72, lng: -9.14 },
      { city: 'Athens', country: 'GR', lat: 37.98, lng: 23.73 },
      { city: 'Prague', country: 'CZ', lat: 50.08, lng: 14.44 },
      { city: 'Bucharest', country: 'RO', lat: 44.43, lng: 26.10 },
      { city: 'Budapest', country: 'HU', lat: 47.50, lng: 19.04 },
      { city: 'Helsinki', country: 'FI', lat: 60.17, lng: 24.94 },
      { city: 'Copenhagen', country: 'DK', lat: 55.68, lng: 12.57 },
      { city: 'Dublin', country: 'IE', lat: 53.35, lng: -6.26 },
      { city: 'Zurich', country: 'CH', lat: 47.38, lng: 8.54 },
      { city: 'Vienna', country: 'AT', lat: 48.21, lng: 16.37 },
      { city: 'Brussels', country: 'BE', lat: 50.85, lng: 4.35 },
      // Americas
      { city: 'Washington DC', country: 'US', lat: 38.91, lng: -77.04 },
      { city: 'Toronto', country: 'CA', lat: 43.65, lng: -79.38 },
      { city: 'Mexico City', country: 'MX', lat: 19.43, lng: -99.13 },
      { city: 'São Paulo', country: 'BR', lat: -23.55, lng: -46.63 },
      { city: 'Buenos Aires', country: 'AR', lat: -34.60, lng: -58.38 },
      { city: 'Bogotá', country: 'CO', lat: 4.71, lng: -74.07 },
      { city: 'Lima', country: 'PE', lat: -12.05, lng: -77.04 },
      { city: 'Santiago', country: 'CL', lat: -33.45, lng: -70.67 },
      // Africa
      { city: 'Cairo', country: 'EG', lat: 30.04, lng: 31.24 },
      { city: 'Lagos', country: 'NG', lat: 6.52, lng: 3.38 },
      { city: 'Johannesburg', country: 'ZA', lat: -26.20, lng: 28.05 },
      { city: 'Nairobi', country: 'KE', lat: -1.29, lng: 36.82 },
      { city: 'Addis Ababa', country: 'ET', lat: 9.02, lng: 38.75 },
      { city: 'Accra', country: 'GH', lat: 5.56, lng: -0.19 },
      { city: 'Dar es Salaam', country: 'TZ', lat: -6.79, lng: 39.28 },
      { city: 'Casablanca', country: 'MA', lat: 33.57, lng: -7.59 },
      { city: 'Algiers', country: 'DZ', lat: 36.75, lng: 3.04 },
      // Oceania
      { city: 'Sydney', country: 'AU', lat: -33.87, lng: 151.21 },
      { city: 'Auckland', country: 'NZ', lat: -36.85, lng: 174.76 },
    ];

    // Comprehensive fallback data for ALL countries
    const fallbackData = {
      US: { aqi: 42, city: 'Washington DC' }, CN: { aqi: 156, city: 'Beijing' },
      IN: { aqi: 198, city: 'Delhi' }, BR: { aqi: 65, city: 'São Paulo' },
      RU: { aqi: 78, city: 'Moscow' }, GB: { aqi: 35, city: 'London' },
      FR: { aqi: 48, city: 'Paris' }, DE: { aqi: 41, city: 'Berlin' },
      JP: { aqi: 52, city: 'Tokyo' }, AU: { aqi: 28, city: 'Sydney' },
      CA: { aqi: 32, city: 'Toronto' }, IT: { aqi: 62, city: 'Rome' },
      ES: { aqi: 45, city: 'Madrid' }, MX: { aqi: 89, city: 'Mexico City' },
      KR: { aqi: 75, city: 'Seoul' }, ID: { aqi: 112, city: 'Jakarta' },
      TR: { aqi: 88, city: 'Istanbul' }, SA: { aqi: 134, city: 'Riyadh' },
      ZA: { aqi: 67, city: 'Johannesburg' }, AR: { aqi: 55, city: 'Buenos Aires' },
      EG: { aqi: 145, city: 'Cairo' }, NG: { aqi: 155, city: 'Lagos' },
      PK: { aqi: 210, city: 'Lahore' }, BD: { aqi: 195, city: 'Dhaka' },
      TH: { aqi: 98, city: 'Bangkok' }, VN: { aqi: 105, city: 'Hanoi' },
      PH: { aqi: 82, city: 'Manila' }, MY: { aqi: 76, city: 'Kuala Lumpur' },
      PL: { aqi: 71, city: 'Warsaw' }, UA: { aqi: 68, city: 'Kyiv' },
      NL: { aqi: 38, city: 'Amsterdam' }, SE: { aqi: 22, city: 'Stockholm' },
      NO: { aqi: 18, city: 'Oslo' }, CH: { aqi: 30, city: 'Zurich' },
      AT: { aqi: 36, city: 'Vienna' }, BE: { aqi: 44, city: 'Brussels' },
      CL: { aqi: 58, city: 'Santiago' }, CO: { aqi: 72, city: 'Bogotá' },
      PE: { aqi: 85, city: 'Lima' }, IR: { aqi: 162, city: 'Tehran' },
      IQ: { aqi: 175, city: 'Baghdad' }, AE: { aqi: 118, city: 'Dubai' },
      IL: { aqi: 55, city: 'Tel Aviv' }, KE: { aqi: 78, city: 'Nairobi' },
      ET: { aqi: 95, city: 'Addis Ababa' }, GH: { aqi: 88, city: 'Accra' },
      TZ: { aqi: 72, city: 'Dar es Salaam' }, NZ: { aqi: 15, city: 'Auckland' },
      PT: { aqi: 34, city: 'Lisbon' }, GR: { aqi: 52, city: 'Athens' },
      CZ: { aqi: 56, city: 'Prague' }, RO: { aqi: 65, city: 'Bucharest' },
      HU: { aqi: 58, city: 'Budapest' }, FI: { aqi: 16, city: 'Helsinki' },
      DK: { aqi: 25, city: 'Copenhagen' }, IE: { aqi: 22, city: 'Dublin' },
      SG: { aqi: 55, city: 'Singapore' }, NP: { aqi: 178, city: 'Kathmandu' },
      LK: { aqi: 85, city: 'Colombo' }, MM: { aqi: 130, city: 'Yangon' },
      KH: { aqi: 110, city: 'Phnom Penh' }, QA: { aqi: 105, city: 'Doha' },
      KW: { aqi: 125, city: 'Kuwait City' }, MA: { aqi: 68, city: 'Casablanca' },
      DZ: { aqi: 85, city: 'Algiers' },
    };

    const apiKey = process.env.OPENWEATHER_API_KEY;
    // Start with fallback data for all countries
    const globalData = { ...fallbackData };

    // Convert OpenWeatherMap AQI (1-5 scale) to US AQI scale  
    const convertToUSAQI = (owmAqi, components) => {
      const pm25 = components?.pm2_5 || 0;
      if (pm25 <= 12) return Math.max(Math.round(pm25 * (50 / 12)), 1);
      if (pm25 <= 35.4) return Math.round(50 + (pm25 - 12) * (50 / 23.4));
      if (pm25 <= 55.4) return Math.round(100 + (pm25 - 35.4) * (50 / 20));
      if (pm25 <= 150.4) return Math.round(150 + (pm25 - 55.4) * (50 / 95));
      if (pm25 <= 250.4) return Math.round(200 + (pm25 - 150.4) * (100 / 100));
      return Math.round(300 + (pm25 - 250.4) * (100 / 149.6));
    };

    if (apiKey) {
      // Fetch in batches to avoid rate-limiting
      const batchSize = 10;
      for (let i = 0; i < worldCities.length; i += batchSize) {
        const batch = worldCities.slice(i, i + batchSize);
        const promises = batch.map(async (loc) => {
          try {
            const response = await axios.get(
              `http://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lng}&appid=${apiKey}`,
              { timeout: 5000 }
            );
            const data = response.data;
            if (data?.list?.[0]) {
              const aqi = convertToUSAQI(data.list[0].main.aqi, data.list[0].components);
              globalData[loc.country] = {
                aqi,
                city: loc.city,
                pm25: Math.round(data.list[0].components?.pm2_5 || 0),
                pm10: Math.round(data.list[0].components?.pm10 || 0),
              };
            }
          } catch (err) {
            // Fallback data already present, skip silently
          }
        });
        await Promise.all(promises);
        // Small delay between batches
        if (i + batchSize < worldCities.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    console.log(`Global AQI: Returning data for ${Object.keys(globalData).length} countries`);
    res.json(globalData);

  } catch (error) {
    console.error('Error fetching global AQI:', error.message);
    // Return fallback even on error
    res.json({
      US: { aqi: 42, city: 'Washington DC' }, CN: { aqi: 156, city: 'Beijing' },
      IN: { aqi: 198, city: 'Delhi' }, GB: { aqi: 35, city: 'London' },
      JP: { aqi: 52, city: 'Tokyo' }, FR: { aqi: 48, city: 'Paris' },
      DE: { aqi: 41, city: 'Berlin' }, BR: { aqi: 65, city: 'São Paulo' },
      AU: { aqi: 28, city: 'Sydney' }, RU: { aqi: 78, city: 'Moscow' },
    });
  }
});

module.exports = router;