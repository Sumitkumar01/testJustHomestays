// pages/api/getImages.js
import axios from "axios";

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Slug is required" });
  }

  const endpoints = ["Property", "StayVista"];
  const API_KEY = "5Yf83FXnUhvvzako9TR_Alb1JBUbFtjZnROi-FVo";
  const API_URL =
    "https://test.justhomestay.in/api/v1/db/data/v1/justhomestay/";

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`, {
        params: { where: `(Slug,eq,${slug})` },
        headers: { "xc-token": API_KEY },
      });

      if (response.status === 200 && response.data.list.length > 0) {
        const data = response.data.list[0];
        const images =
          data.Type === "JHS"
            ? data.Images.map(
                (img) => `https://test.justhomestay.in/${img.path}`
              )
            : JSON.parse(data.Images);
        return res.status(200).json({
          images,
          type: data.Type,
        });
      }
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
    }
  }

  return res.status(404).json({ error: "Images not found" });
}
