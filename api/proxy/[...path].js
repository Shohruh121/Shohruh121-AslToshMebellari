export const config = {
  api: { bodyParser: false, responseLimit: '10mb' }
};

export default async function handler(req, res) {
  // req.query.path is an array of path segments from [...path]
  const pathSegments = req.query.path || [];
  const proxyPath = pathSegments.join('/');

  // Build query string from remaining params (exclude 'path')
  const url = new URL(req.url, 'http://localhost');
  const params = [];
  for (const [key, val] of url.searchParams) {
    if (key !== 'path') params.push(key + '=' + val);
  }
  let targetUrl = 'https://interstone.uz/' + proxyPath;
  if (params.length) targetUrl += '?' + params.join('&');

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
    res.setHeader('Access-Control-Allow-Origin', '*');

    const buffer = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(buffer);
  } catch (e) {
    res.status(500).json({ error: e.message, targetUrl });
  }
}
