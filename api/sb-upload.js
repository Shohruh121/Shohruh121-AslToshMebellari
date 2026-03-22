export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY;
  const BUCKET = 'Tosh';

  try {
    const chunks = [];
    for await (const chunk of req) { chunks.push(chunk); }
    const rawBody = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';

    // Extract filename from query
    const url = new URL(req.url, 'http://localhost');
    const filename = url.searchParams.get('filename') || ('decor-' + Date.now() + '.jpg');

    // Upload to Supabase Storage
    const uploadUrl = `${SB_URL}/storage/v1/object/${BUCKET}/${filename}`;
    const r = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'x-upsert': 'true'
      },
      body: rawBody
    });

    if (!r.ok) {
      const errText = await r.text();
      res.status(r.status).json({ error: errText });
      return;
    }

    // Return public URL
    const publicUrl = `${SB_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
    res.status(200).json({ ok: true, url: publicUrl });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
