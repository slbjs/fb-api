// Vercel Serverless Function
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, error: 'Missing Facebook video URL.' });
  }

  const apiUrl = `https://fb.sl-bjs.workers.dev/url?down=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.url) {
      return res.status(404).json({ success: false, error: 'Video not found or invalid link.' });
    }

    return res.json({
      success: true,
      title: data.title || 'Untitled',
      videos: {
        sd: {
          url: data.sd || null,
          size: data.sd_size || null
        },
        hd: {
          url: data.url || null,
          size: data.size || null
        }
      },
      direct_download_url: data.url
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error', detail: error.message });
  }
}
