import axios from 'axios';

export default async function handler(req, res) {
  const { imgUrl } = req.query;

  if (!imgUrl) {
    return res.status(400).json({ error: 'Missing image URL' });
  }

  try {
    // Make a HEAD request with increased timeout to handle server slowness
    const response = await axios.head(imgUrl, {
      timeout: 10000, // 10 seconds timeout
    });

    // If the status is 200, the image is valid
    if (response.status === 200) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(400).json({ valid: false });
    }
  } catch (error) {
    // Check if the error is due to a timeout
    if (error.code === 'ETIMEDOUT') {
      console.error(`Timeout fetching image: ${imgUrl}`, error.message);
    } else {
      console.error(`Error fetching image: ${imgUrl}`, error.message);
    }
    // Gracefully return a 400 response if there's any issue
    return res.status(400).json({ valid: false });
  }
}
