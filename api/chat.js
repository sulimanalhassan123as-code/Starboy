// Vercel Serverless Function — Groq AI Community Chat
// Set GROQ_API_KEY in Vercel Environment Variables

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY not set' });

  // Build conversation history for context
  const messages = [
    {
      role: 'system',
      content: `You are "Suleiman AI", a friendly and knowledgeable Islamic community assistant for the Suleiman Play Store — a mobile app store by Never Hide Tech Empire. 
You help users with Islamic knowledge (Quran, Hadith, Fiqh, Islamic history), app recommendations from the store, and general community support.
Keep responses SHORT (1-3 sentences max), warm, and use Islamic greetings naturally. 
Occasionally say JazakAllah Khayr, MashaAllah, Alhamdulillah where appropriate but don't overdo it.
Never make up hadith or Quran verses — if unsure, say so honestly.
You respond when no human has replied in the community for a few seconds.`
    }
  ];

  // Add recent chat history for context (last 6 messages)
  if (Array.isArray(history)) {
    history.slice(-6).forEach(m => {
      messages.push({
        role: m.mine ? 'user' : 'assistant',
        content: m.text
      });
    });
  }

  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages,
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq error:', err);
      return res.status(500).json({ error: 'Groq API error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return res.status(500).json({ error: 'No reply from Groq' });

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Fetch error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
