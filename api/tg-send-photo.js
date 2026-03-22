export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || '').split(',').map(s => s.trim());

  try {
    const chunks = [];
    for await (const chunk of req) { chunks.push(chunk); }
    const rawBody = Buffer.concat(chunks);
    const contentType = req.headers['content-type'] || '';

    const results = [];
    for (const chatId of CHAT_IDS) {
      const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: rawBody
      });
      results.push(await r.json());
    }
    res.status(200).json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
