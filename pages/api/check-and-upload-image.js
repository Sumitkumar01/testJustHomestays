import sharp from "sharp";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import NodeCache from "node-cache";

// Set up Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const BUCKET_NAME = "storage"; // Name of your Supabase storage bucket

// Simple in-memory cache to avoid repeated processing
const cache = new NodeCache({ stdTTL: 60*60*24*30*12 });

export default async function handler(req, res) {
  const { imgUrl, width = 400, quality = 80 } = req.query;

  if (!imgUrl) {
    return res.status(400).json({ error: "Missing image URL" });
  }

  // Sanitize the image URL for file name
  const cacheKey = `${imgUrl.replace(/\//g, "_")}-${width}-${quality}.webp`;
  const supabaseUrl = `https://cctumpvdqritggnfange.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${cacheKey}`;

  // Step 0: Check in memory cache first
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    return res.status(200).json({ url: cachedResult });
  }

  try {
    // Step 1: Check if the image already exists in Supabase using a HEAD request
    try {
      const supabaseHeadResponse = await axios.head(supabaseUrl);
      if (supabaseHeadResponse.status === 200) {
        // Cache the result for future use
        cache.set(cacheKey, supabaseUrl);
        return res.status(200).json({ url: supabaseUrl });
      }
    } catch (error) {
      // Supabase image doesn't exist or check failed
      console.log("Image does not exist in Supabase, proceeding to fetch and process the original image.");
    }

    // Step 2: Fetch, resize, and convert the image to WebP format directly (skip HEAD request for original image)
    const response = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 5000 });
    if (response.status !== 200) {
      return res.status(response.status).json({ error: "Failed to fetch image from the provided URL" });
    }

    const originalImageBuffer = response.data;

    // Step 3: Ensure the width is parsed correctly, and auto-calculate the height based on aspect ratio
    const parsedWidth = parseInt(width, 10);
    if (isNaN(parsedWidth) || parsedWidth <= 0) {
      return res.status(400).json({ error: "Invalid width provided" });
    }

    const processedImage = await sharp(originalImageBuffer)
      .resize({ width: parsedWidth }) // Only specify width; sharp will auto-calculate height
      .webp({ quality: Math.min(parseInt(quality), 80), effort: 2 }) // Use lower effort for faster compression
      .toBuffer();

    // Step 4: Upload the processed image to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(cacheKey, processedImage, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({ error: "Error uploading image to Supabase" });
    }

    // Cache the newly uploaded image
    cache.set(cacheKey, supabaseUrl);

    // Step 5: Return the newly uploaded Supabase image URL
    return res.status(200).json({ url: supabaseUrl });

  } catch (error) {
    // Handle any other errors such as network issues or image processing failures
    console.error(`Error processing image: ${imgUrl}`, error.message);
    return res.status(500).json({ error: "Error processing image", url: null });
  }
}
