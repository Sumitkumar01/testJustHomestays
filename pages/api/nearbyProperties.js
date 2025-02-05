// pages/api/nearbyProperties.js

import axios from 'axios';

export const config = {
  api: {
    responseLimit: false,
  },
}

export default async (req, res) => {
  const { lat, lng, dist } = req.query;

  // Validate query parameters
  if (!lat || !lng || !dist) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  // Get all properties from StayVista table
  const options = {
    method: "GET",
    url: process.env.API_URL + "StayVista/views/StayvistaSchemaCsv",
    params: {limit: 1000},
    headers: {
      "xc-token": process.env.API_KEY
    }
  };
  
  const response = await axios.request(options);

  // Filter properties based on selected distance
  const nearbyProperties = response.data.list.filter(property => 
    haversineDistance({ latitude: lat, longitude: lng }, { latitude: property.Latitude, longitude: property.Longitude }) <= dist
  );

  return res.status(200).json(nearbyProperties);
}

// Haversine distance calculation
const haversineDistance = (coords1, coords2) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // Radius of the earth in km

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d;
};
