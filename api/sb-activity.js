export default async function handler(req, res) {
  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  if (req.method === 'POST') {
    try {
      await fetch(`${SB_URL}/rest/v1/activity_log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` },
        body: JSON.stringify(req.body)
      });
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else if (req.method === 'GET') {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/activity_log?order=created_at.desc&limit=20`, {
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
      });
      const data = await r.json();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
