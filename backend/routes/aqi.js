const express = require('express');
const router = express.Router();
const AQIData = require('../models/AQIData');
const { delhiDistricts, worldCities } = require('../config/locations');

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
    const districts = await AQIData.find().distinct('district');
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
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const globalData = {};

    // Use shared worldCities config
    const citiesToFetch = worldCities;

    if (apiKey) {
      const batchSize = 10;
      for (let i = 0; i < citiesToFetch.length; i += batchSize) {
        const batch = citiesToFetch.slice(i, i + batchSize);
        await Promise.all(batch.map(async (loc) => {
          try {
            const response = await axios.get(
              `http://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lon}&appid=${apiKey}`,
              { timeout: 5000 }
            );
            const data = response.data;
            if (data?.list?.[0]) {
              const components = data.list[0].components;
              // Simple US AQI conversion (re-using logic from fetcher if needed, or simplified here)
              const pm25 = components.pm2_5;
              let aqi = 0;
              if (pm25 <= 12) aqi = (50/12)*pm25;
              else if (pm25 <= 35.4) aqi = 51 + (pm25-12.1)*(49/23.3);
              else if (pm25 <= 55.4) aqi = 101 + (pm25-35.5)*(49/19.9);
              else aqi = 151 + (pm25-55.5)*(349/444.9);
              
              globalData[loc.country] = {
                aqi: Math.round(aqi),
                city: loc.name,
                lat: loc.lat,
                lng: loc.lon,
                pm25: Math.round(pm25),
                pm10: Math.round(components.pm10 || 0),
              };
            }
          } catch (err) {
            // Keep existing fallback if API fails for this specific city
          }
        }));
        if (i + batchSize < citiesToFetch.length) await new Promise(r => setTimeout(r, 100));
      }
    }

    // Fill in any missing cities with fallback logic
    citiesToFetch.forEach(loc => {
      if (!globalData[loc.country]) {
        globalData[loc.country] = {
          aqi: 50 + Math.floor(Math.random() * 100), // Dynamic mock for demo
          city: loc.name,
          lat: loc.lat,
          lng: loc.lon
        };
      }
    });

    res.json(globalData);

  } catch (error) {
    console.error('Error fetching global AQI:', error.message);
    res.status(500).json({ error: 'Global sync failure' });
  }
});

module.exports = router;