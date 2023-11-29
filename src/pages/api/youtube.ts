// pages/api/download.js
import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let videoUrl = req.query.videoUrl;
  console.log(videoUrl);
  // Ensure videoUrl is always a string
  if (Array.isArray(videoUrl)) {
    videoUrl = videoUrl[0];
  }
  try {
    if (!videoUrl) return;
    const info = await ytdl.getInfo(videoUrl);

 
    res.send(info.formats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download video" });
  }
}
