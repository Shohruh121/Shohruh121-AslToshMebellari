export const config = {
  api: { bodyParser: false, responseLimit: '10mb' }
};

export default async function handler(req, res) {
  // Extract path from query - Vercel passes it via ?path=...
  let proxyPath = req.query.path || '';
  // Also append any extra query params (like lang=ru&area=...)
  const url = new URL(req.url, 'http://localhost');
  const extraParams = [];
  for (const [key, val] of url.searchParams) {
    if (key !== 'path') extraParams.push(key + '=' + encodeURIComponent(val));
  }
  let targetUrl = 'https://interstone.uz/' + proxyPath;
  if (extraParams.length) targetUrl += (targetUrl.includes('?') ? '&' : '?') + extraParams.join('&');

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': req.headers['accept'] || '*/*',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    };
    if (req.headers['x-requested-with']) {
      headers['X-Requested-With'] = req.headers['x-requested-with'];
    }

    const response = await fetch(targetUrl, { headers });

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=300');

    const buffer = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(buffer);
  } catch (e) {
    res.status(500).json({ error: e.message, url: targetUrl });
  }
}
