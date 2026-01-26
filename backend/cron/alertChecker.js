const cron = require('node-cron');
const AQIData = require('../models/AQIData');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');

// Function to check AQI levels and send alerts
const checkAQIAlerts = async () => {
  try {
    console.log('Checking AQI levels for alerts...');

    // Get the latest AQI data for each district
    const latestAQI = await AQIData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: '$district',
          aqi: { $first: '$aqi' },
          category: { $first: '$category' },
          timestamp: { $first: '$timestamp' }
        }
      }
    ]);

    // Get users who want email alerts
    const users = await User.find({ emailAlerts: true });

    if (users.length === 0) {
      console.log('No users with email alerts enabled');
      return;
    }

    // Check for unhealthy AQI levels (>150)
    const unhealthyDistricts = latestAQI.filter(data => data.aqi > 150);

    if (unhealthyDistricts.length === 0) {
      console.log('✅ All districts have acceptable AQI levels');
      return;
    }

    // Send alerts to users
    for (const user of users) {
      const emailContent = generateAlertEmail(unhealthyDistricts);
      
      try {
        await sendEmail(
          user.email,
          'Delhi Air Quality Alert - Unhealthy Levels Detected',
          emailContent
        );
        console.log(`✅ Alert sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send alert to ${user.email}:`, error.message);
      }
    }

    console.log(`📧 Sent alerts for ${unhealthyDistricts.length} districts to ${users.length} users`);

  } catch (error) {
    console.error('Error checking AQI alerts:', error);
  }
};

// Generate email content for alerts
const generateAlertEmail = (districts) => {
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff0000;">⚠️ Air Quality Alert - Delhi</h2>
      <p>The following districts have unhealthy air quality levels:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">District</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">AQI</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Category</th>
          </tr>
        </thead>
        <tbody>
  `;

  districts.forEach(district => {
    const color = district.aqi > 200 ? '#8f3f97' : '#ff0000';
    html += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${district._id}</td>
        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: ${color};">${district.aqi}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${district.category}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #856404;">Health Recommendations:</h3>
        <ul>
          <li>Avoid outdoor activities</li>
          <li>Keep windows closed</li>
          <li>Use air purifiers indoors</li>
          <li>Wear N95 masks if you must go outside</li>
        </ul>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        This is an automated alert from Delhi Pollution Tracker.<br>
        You can manage your alert preferences in your account settings.
      </p>
    </div>
  `;

  return html;
};

// Schedule to run every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('Running scheduled AQI alert check...');
  checkAQIAlerts();
});

console.log('Alert check scheduler started (runs every 30 minutes)');

module.exports = { checkAQIAlerts };