import axios from "axios";

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

async function insertContact(contactData) {
  try {
    const response = await axios.post(API_URL+"Contact", contactData, {
      headers: {
        "Content-Type": "application/json",
        "xc-token": API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error inserting contact:", error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const contactData = req.body;
    const result = await insertContact(contactData);

    if (result) {
      res.status(200).json({ message: "Contact form submitted successfully" });
    } else {
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
