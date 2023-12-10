import ytmux from '@/lib/ytmux';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const videoLink = 'https://www.youtube.com/watch?v=SAcpESN_Fk4'; // You can use req.body.videoURL if needed
    const options = {};

    const outputStream = ytmux(videoLink, options);
    const filename = 'output.mkv';

    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'video/x-matroska');

    // Pipe the output stream to the response
    outputStream.on('error', (error) => {
      console.error('Error in outputStream:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    res.on('error', (error) => {
      console.error('Error in response stream:', error);
    });

    outputStream.pipe(res);

    // Handle events (optional)
    res.on('finish', () => {
      console.log('Download triggered successfully.');
    });

    res.on('error', (err) => {
      console.error('Error triggering download:', err);
    });
  } catch (error) {
    console.error('Error in download handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
