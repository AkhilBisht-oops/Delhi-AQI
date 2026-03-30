// Approximate GeoJSON boundaries for Delhi districts
// These are simplified polygons for visualization purposes

const delhiDistrictsGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Central Delhi', id: 'central' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.1980, 28.6500], [77.2450, 28.6550], [77.2550, 28.6350],
          [77.2400, 28.6150], [77.2100, 28.6150], [77.1980, 28.6500]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'North Delhi', id: 'north' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.0700, 28.6900], [77.1300, 28.7300], [77.1600, 28.7200],
          [77.1500, 28.6800], [77.1100, 28.6600], [77.0700, 28.6900]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'South Delhi', id: 'south' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.1800, 28.5600], [77.2600, 28.5700], [77.2900, 28.5300],
          [77.2700, 28.5000], [77.2200, 28.4900], [77.1800, 28.5100],
          [77.1800, 28.5600]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'East Delhi', id: 'east' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.2800, 28.6900], [77.3400, 28.6900], [77.3500, 28.6500],
          [77.3200, 28.6300], [77.2800, 28.6400], [77.2800, 28.6900]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'West Delhi', id: 'west' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.0400, 28.6800], [77.1100, 28.6800], [77.1200, 28.6400],
          [77.1100, 28.6100], [77.0500, 28.6200], [77.0400, 28.6800]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'New Delhi', id: 'newdelhi' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.1700, 28.6300], [77.2200, 28.6350], [77.2400, 28.6100],
          [77.2300, 28.5800], [77.1900, 28.5800], [77.1700, 28.6000],
          [77.1700, 28.6300]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'North East Delhi', id: 'northeast' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.2500, 28.7000], [77.3100, 28.7400], [77.3300, 28.7200],
          [77.3100, 28.6900], [77.2700, 28.6800], [77.2500, 28.7000]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'North West Delhi', id: 'northwest' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.9800, 28.7200], [77.0600, 28.7700], [77.1200, 28.7500],
          [77.1100, 28.7000], [77.0500, 28.6800], [76.9800, 28.7200]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'South East Delhi', id: 'southeast' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.2500, 28.5800], [77.3100, 28.5900], [77.3200, 28.5500],
          [77.2900, 28.5200], [77.2500, 28.5400], [77.2500, 28.5800]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'South West Delhi', id: 'southwest' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.0100, 28.6100], [77.0800, 28.6200], [77.1000, 28.5800],
          [77.0800, 28.5300], [77.0200, 28.5400], [77.0100, 28.6100]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Shahdara', id: 'shahdara' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [77.2700, 28.7000], [77.3200, 28.7000], [77.3300, 28.6600],
          [77.2900, 28.6400], [77.2600, 28.6600], [77.2700, 28.7000]
        ]]
      }
    }
  ]
};

export default delhiDistrictsGeoJSON;
