// pages/api/getLocations.js

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/Location?limit=1000&sort=-TotalCount&where=(TotalCount,gt,0)&fields=Town,State,Image,CountSV,CountJHS`,
      {
        method: "GET",
        headers: {
          "xc-token": "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    const data = await response.json();

    return res.status(200).json(data.list || []);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).json({ error: "Failed to fetch locations" });
  }
}
