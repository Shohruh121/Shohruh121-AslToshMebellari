export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  const id = req.query.id;
  if (!id) { res.status(400).json({ error: 'Missing id' }); return; }

  try {
    await fetch(`${SB_URL}/rest/v1/decors?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}` }
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
