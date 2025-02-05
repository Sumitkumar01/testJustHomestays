import ical from "ical";

export default async function handler(req, res) {
  const {calID, startDate, endDate} = req.query;

  try {
    const response = await fetch(calID, {
      headers: {
        Accept: "text/calendar"
      }
    });
    const icsData = await response.text();
    const parsedData = ical.parseICS(icsData);

    let available = false;
    for (let key in parsedData) {
      if (parsedData.hasOwnProperty(key)) {
        const icalEvent = parsedData[key];
        if (icalEvent.type === 'Available') {
          const eventStartDate = new Date(icalEvent.start);
          const eventEndDate = new Date(icalEvent.end);
          if (eventStartDate >= new Date(startDate) && eventEndDate <= new Date(endDate)) {
            available = true;
            break;
          }
        }
      }
    }

    res.status(200).json({available: available ? 1 : 0});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}
