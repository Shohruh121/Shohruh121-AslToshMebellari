export default async function handler(req, res) {
  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY;

  if (!SB_URL || !SB_KEY) {
    res.status(500).json({ error: 'Missing env vars' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/site_config?key=eq.featured_ids&limit=1`, {
        headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
      });
      const data = await r.json();
      if (Array.isArray(data) && data.length > 0) {
        res.status(200).json(data[0]);
      } else {
        res.status(200).json({ key: 'featured_ids', value: [] });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else if (req.method === 'POST') {
    let body = '';
    for await (const chunk of req) { body += chunk; }
    try {
      const parsed = JSON.parse(body);
      // Upsert: insert or update featured_ids
      const r = await fetch(`${SB_URL}/rest/v1/site_config?on_conflict=key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SB_KEY,
          'Authorization': `Bearer ${SB_KEY}`,
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({ key: 'featured_ids', value: parsed.value || [] })
      });
      const data = await r.json();
      res.status(200).json(Array.isArray(data) ? data[0] : data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
