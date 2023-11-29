import { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.query);
  let videoUrl = req.query.videoUrl;
  let videoQuality = req.query.videoQuality;
  console.log(videoUrl);
  console.log(videoQuality);

  if (Array.isArray(videoUrl)) {
    videoUrl = videoUrl[0];
  }

  try {
    if (!videoUrl) {
      return res.status(400).json({ error: "Missing videoUrl parameter" });
    }

    const itag = 18;
    const info = await ytdl.getInfo(videoUrl);

    // Validate videoQuality against available formats
    const format = info.formats.find((item) => item.itag === itag);

    console.log("Formats log", format);
    if (!format) {
      return res.status(400).json({ error: "Invalid videoQuality parameter" });
    }

  
    res.setHeader("Content-Type", "video/mp4");

    // Pipe the video stream directly to the response
    ytdl(videoUrl, { format }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download video" });
  }
}