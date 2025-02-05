// pages/api/getFeaturedLocations.js

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Location/views/Featured?limit=100`,
      {
        method: "GET",
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching locations: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json(data.list || []);
  } catch (error) {
    console.error("Error fetching featured locations:", error);
    res.status(500).json({ error: "Failed to fetch featured locations" });
  }
}
