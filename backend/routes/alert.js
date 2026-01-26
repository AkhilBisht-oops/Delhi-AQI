const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// Get user alert preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('alertPreferences');
    res.json({ preferences: user.alertPreferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update alert preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { enabled, threshold, notificationMethods, districts } = req.body;

    const user = await User.findById(req.userId);
    
    if (enabled !== undefined) user.alertPreferences.enabled = enabled;
    if (threshold !== undefined) user.alertPreferences.threshold = threshold;
    if (notificationMethods) {
      user.alertPreferences.notificationMethods = {
        ...user.alertPreferences.notificationMethods,
        ...notificationMethods
      };
    }
    if (districts) user.alertPreferences.districts = districts;

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.alertPreferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Admin: Get all subscribers
router.get('/subscribers', adminAuth, async (req, res) => {
  try {
    const subscribers = await User.find({
      'alertPreferences.enabled': true
    }).select('name email phone alertPreferences createdAt');

    res.json({
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

module.exports = router;