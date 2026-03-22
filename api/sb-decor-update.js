export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'PATCH') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  const id = req.query.id;
  if (!id) { res.status(400).json({ error: 'Missing id' }); return; }

  try {
    const r = await fetch(`${SB_URL}/rest/v1/decors?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Prefer': 'return=representation' },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
