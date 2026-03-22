import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/',
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/iapi': { target: 'https://interstone.uz', changeOrigin: true, rewrite: (path) => path.replace(/^\/iapi/, '/api') },
        '/media': { target: 'https://interstone.uz', changeOrigin: true },
        '/storage': { target: 'https://interstone.uz', changeOrigin: true },
        '/front': { target: 'https://interstone.uz', changeOrigin: true },
        '/visualizer': { target: 'https://interstone.uz', changeOrigin: true }
      }
    },
    plugins: [
      {
        name: 'api-proxy',
        configureServer(server) {
          const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
          const CHAT_IDS = (env.TELEGRAM_CHAT_IDS || '').split(',').map(s => s.trim());
          const SB_URL = env.VITE_SUPABASE_URL;
          const SB_KEY = env.VITE_SUPABASE_ANON_KEY;

          // ---- Supabase proxy endpoints ----

          // POST /sb/increment-visitor
          server.middlewares.use('/sb/increment-visitor', async (req, res) => {
            if (req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
            try {
              const r = await fetch(`${SB_URL}/rest/v1/rpc/increment_visitor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
              });
              const data = await r.text();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ ok: false, error: e.message }));
            }
          });

          // GET /sb/visitors?days=14
          server.middlewares.use('/sb/visitors', async (req, res) => {
            try {
              const url = new URL(req.url, 'http://localhost');
              const days = parseInt(url.searchParams.get('days') || '30');
              const since = new Date();
              since.setDate(since.getDate() - days);
              const sinceStr = since.toISOString().split('T')[0];
              const r = await fetch(`${SB_URL}/rest/v1/visitors?visit_date=gte.${sinceStr}&order=visit_date.asc`, {
                headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
              });
              const data = await r.json();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });

          // GET /sb/decors — list all decors
          server.middlewares.use('/sb/decors', async (req, res) => {
            if (req.method === 'GET') {
              try {
                const r = await fetch(`${SB_URL}/rest/v1/decors?order=created_at.desc&limit=5000`, {
                  headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
                });
                const data = await r.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            } else if (req.method === 'POST') {
              // Insert new decor
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const r = await fetch(`${SB_URL}/rest/v1/decors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Prefer': 'return=representation' },
                    body
                  });
                  const data = await r.json();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end('Method not allowed');
            }
          });

          // PATCH /sb/decor-update?id=123
          server.middlewares.use('/sb/decor-update', async (req, res) => {
            if (req.method !== 'PATCH' && req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
            const url = new URL(req.url, 'http://localhost');
            const id = url.searchParams.get('id');
            if (!id) { res.statusCode = 400; res.end('Missing id'); return; }
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const r = await fetch(`${SB_URL}/rest/v1/decors?id=eq.${id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Prefer': 'return=representation' },
                  body
                });
                const data = await r.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          });

          // DELETE /sb/decor-delete?id=123
          server.middlewares.use('/sb/decor-delete', async (req, res) => {
            if (req.method !== 'DELETE' && req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
            const url = new URL(req.url, 'http://localhost');
            const id = url.searchParams.get('id');
            if (!id) { res.statusCode = 400; res.end('Missing id'); return; }
            try {
              const r = await fetch(`${SB_URL}/rest/v1/decors?id=eq.${id}`, {
                method: 'DELETE',
                headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
              });
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });

          // POST /sb/activity — log activity
          server.middlewares.use('/sb/activity', async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const r = await fetch(`${SB_URL}/rest/v1/activity_log`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` },
                    body
                  });
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true }));
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else if (req.method === 'GET') {
              try {
                const r = await fetch(`${SB_URL}/rest/v1/activity_log?order=created_at.desc&limit=20`, {
                  headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
                });
                const data = await r.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: e.message }));
              }
            }
          });

          // ---- Telegram proxy endpoints ----

          // POST /tg/sendMessage — proxy text messages
          server.middlewares.use('/tg/sendMessage', async (req, res) => {
            if (req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const data = JSON.parse(body);
                const text = data.text || '';
                const results = [];
                for (const chatId of CHAT_IDS) {
                  const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
                  });
                  results.push(await r.json());
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, results }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ ok: false, error: e.message }));
              }
            });
          });

          // POST /tg/sendPhoto — proxy photo messages
          server.middlewares.use('/tg/sendPhoto', async (req, res) => {
            if (req.method !== 'POST') { res.statusCode = 405; res.end('Method not allowed'); return; }
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', async () => {
              try {
                const rawBody = Buffer.concat(chunks);
                const results = [];
                for (const chatId of CHAT_IDS) {
                  // Extract boundary from content-type
                  const contentType = req.headers['content-type'] || '';
                  // Re-inject chat_id into the form data
                  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${chatId}`;
                  const r = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': contentType },
                    body: rawBody
                  });
                  results.push(await r.json());
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, results }));
              } catch (e) {
                res.statusCode = 500;
                res.end(JSON.stringify({ ok: false, error: e.message }));
              }
            });
          });
        }
      }
    ],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          catalog: resolve(__dirname, 'catalog.html'),
          admin: resolve(__dirname, 'admin.html'),
          kitchen3d: resolve(__dirname, '3d-kitchen.html'),
        },
      },
    }
  };
});
