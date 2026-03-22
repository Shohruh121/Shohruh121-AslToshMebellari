export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Proxy interstone.uz paths
  const proxyPaths = ['/visualizer/', '/front/', '/storage/', '/media/'];
  const isIapi = path.startsWith('/iapi/');
  const shouldProxy = proxyPaths.some(p => path.startsWith(p)) || isIapi;

  if (!shouldProxy) return;

  // Build target URL: /iapi/xxx -> interstone.uz/api/xxx, others -> interstone.uz/path
  let targetPath = isIapi ? '/api/' + path.slice(6) : path;
  const targetUrl = 'https://interstone.uz' + targetPath + url.search;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': request.headers.get('accept') || '*/*',
        'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
        'X-Requested-With': request.headers.get('x-requested-with') || '',
      },
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: ['/visualizer/:path*', '/front/:path*', '/storage/:path*', '/media/:path*', '/iapi/:path*'],
};
