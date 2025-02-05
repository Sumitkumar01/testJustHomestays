// pages/api/availability.js

import ical from 'ical';

export default async function handler(req, res) {
  const calID = req.query.calID;

  try {
    const response = await fetch(calID, {
      headers: {
        Accept: "text/calendar"
      }
    });
    const icsData = await response.text();
    const parsedData = ical.parseICS(icsData);

    res.status(200).json(parsedData);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}
