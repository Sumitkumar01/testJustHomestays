import icalendar from "ical-generator";
import axios from "axios";
import { format, parseISO, addDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  // Get the 'pid' query parameter from the request
  const pid = req.query.pid;

  try {
    // Make a request to the NocoDB API to fetch events
    const options = {
      method: "GET",
      url: process.env.API_URL + "Bookings",
      params: {
        where: `(PID,eq,${pid})~and(Status,eq,Booked)`,
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    const nocodbResponse = await axios.request(options);
    const eventsData = nocodbResponse.data.list;

    const filename = `${pid}.ics`;

    const calendar = icalendar({
      prodId: "//justhomestay.in//ical-generator//EN",
    });

    // Loop through the events and add them to the calendar
    eventsData.forEach((event) => {
      // Convert the start and end dates to Indian Standard Time (IST)
      const startDateUTC = parseISO(event.From);
      const endDateUTC = parseISO(event.To);

      // Adjust the dates to match your desired date logic
      const startDateIST = utcToZonedTime(addDays(startDateUTC, 1), "Asia/Kolkata");
      const endDateIST = utcToZonedTime(addDays(endDateUTC, 1), "Asia/Kolkata");

      calendar.createEvent({
        start: format(startDateIST, "yyyy-MM-dd'T'HH:mm:ssxxx"), // Use the adjusted start date in IST
        end: format(endDateIST, "yyyy-MM-dd'T'HH:mm:ssxxx"), // Use the adjusted end date in IST
        summary: `${event["Booking ID"]} for ${pid}`,
        description: "Booked from JHS Website",
        url: "https://justhomestay.in",
      });
    });

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename='${filename}'`);
    return res.status(200).send(calendar.toString());
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
