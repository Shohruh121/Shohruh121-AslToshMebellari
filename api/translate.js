export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { text, from = 'uz', to = 'ru' } = req.body || {};
    if (!text) {
      res.status(200).json({ translated: '' });
      return;
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const r = await fetch(url);
    const data = await r.json();

    let translated = '';
    if (Array.isArray(data) && Array.isArray(data[0])) {
      translated = data[0].map(s => s[0]).join('');
    }

    res.status(200).json({ translated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
