import sharp from 'sharp';
import axios from 'axios';
import NodeCache from 'node-cache';

const imageCache = new NodeCache({ stdTTL: 3600 });

export default async function handler(req, res) {
  const { imageUrl, width = 600, quality = 100 } = req.query;

  if (!imageUrl) {
    res.status(400).send('Missing "imageUrl" query parameter');
    return;
  }

  const cacheKey = `${imageUrl}-${width}-${quality}`;
  try {
    const cachedImage = imageCache.get(cacheKey);

    if (cachedImage) {
      res.setHeader('Content-Type', 'image/webp');
      res.send(cachedImage);
      return;
    }

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    if (response.status !== 200) {
      res.status(response.status).send('Failed to fetch image');
      return;
    }

    const processedImage = await sharp(response.data)
      .resize(parseInt(width))
      .webp({ quality: parseInt(quality) })
      .toBuffer();

    imageCache.set(cacheKey, processedImage);
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(processedImage);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Error processing image');
  }
}
