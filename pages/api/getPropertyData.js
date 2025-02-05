import axios from "axios";

export default async function handler(req, res) {
  const { type, property } = req.query;

  if (!property) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    let pid =
      type === "JHS" ? `ncRecordId,eq,${property}` : `PID,eq,${property}`;
    const url =
      process.env.API_URL + (type === "JHS" ? "Property" : "StayVista");

    const response = await axios.get(url, {
      params: {
        where: `(${pid})`,
        fields:
          "Images,Title,Slug,Type,Town,Number of Bedrooms,Cost per Night,Price,Total Guests,Number of Bathrooms,Pets Allowed,Instant Booking,PID",
      },
      headers: {
        "xc-token": process.env.API_KEY,
      },
    });

    if (response.data.list && response.data.list.length > 0) {
      return res.status(200).json(response.data.list[0]);
    } else {
      return res.status(404).json({ error: "Property not found" });
    }
  } catch (error) {
    console.error("Error fetching property data:", error);
    return res.status(500).json({ error: "Failed to fetch property data" });
  }
}
