import axios from "axios";
import * as ical from "ical";

export default async function handler(req, res) {
  try {
    const pid = req.query.id;
    const bookedDates = [];

    const options = {
      method: "GET",
      url: process.env.API_URL + "Property",
      params: {
        where: "(ncRecordId,like," + pid.toString() + ")",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };
    const temp = await axios.request(options);

    if (
      temp.data.list &&
      temp.data.list.length > 0 &&
      temp.data.list[0]["Calendar ID"]
    ) {
      const url = temp.data.list[0]["Calendar ID"];
      const response = await axios.get(url);
      const parsedData = ical.parseICS(response.data);

      for (let key in parsedData) {
        if (parsedData[key].type === "VEVENT") {
          const startDate = new Date(parsedData[key].start);
          const endDate = new Date(parsedData[key].end);

          // Mark dates as booked, excluding the end date
          for (
            let date = new Date(startDate);
            date < endDate.setDate(endDate.getDate());
            date.setDate(date.getDate() + 1)
          ) {
            bookedDates.push(new Date(date));
          }
        }
      }
    }

    const options2 = {
      method: "GET",
      url: process.env.API_URL + "Bookings",
      params: {
        where: `(PID,eq,${pid})~and(Status,eq,Booked)`,
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    };

    const nocodbResponse = await axios.request(options2);
    const nocodbEvents = nocodbResponse.data.list;

    for (let i = 0; i < nocodbEvents.length; i++) {
      const nocodbEvent = nocodbEvents[i];
      const startDate = new Date(nocodbEvent.From);
      const endDate = new Date(nocodbEvent.To);

      // Mark dates as booked, excluding the end date
      for (
        let date = new Date(startDate);
        date < endDate;
        date.setDate(date.getDate() + 1)
      ) {
        bookedDates.push(new Date(date));
      }
    }
    res.status(200).json({ bookedDates });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching data");
  }
}
