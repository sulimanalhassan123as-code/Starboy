// Vercel Serverless Function — Customer.io Registration
// Place your credentials in Vercel Environment Variables:
// CUSTOMERIO_SITE_ID and CUSTOMERIO_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone required' });
  }

  const SITE_ID = process.env.CUSTOMERIO_SITE_ID;
  const API_KEY = process.env.CUSTOMERIO_API_KEY;

  if (!SITE_ID || !API_KEY) {
    return res.status(500).json({ error: 'API credentials not configured' });
  }

  const auth = Buffer.from(`${SITE_ID}:${API_KEY}`).toString('base64');
  const identifier = phone.replace(/\s+/g, '');

  try {
    // Step 1 — Create / identify the person in Customer.io
    await fetch(`https://track-eu.customer.io/api/v1/customers/${identifier}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: identifier,
        name: name,
        created_at: Math.floor(Date.now() / 1000),
        source: 'Suleiman Play Store'
      })
    });

    // Step 2 — Fire welcome event (triggers your Campaign in Customer.io)
    await fetch(`https://track-eu.customer.io/api/v1/customers/${identifier}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'new_visitor',
        data: {
          name: name,
          phone: identifier,
          joined_at: new Date().toISOString()
        }
      })
    });

    return res.status(200).json({ success: true, message: 'Welcome message sent!' });

  } catch (err) {
    console.error('Customer.io error:', err);
    return res.status(500).json({ error: 'Failed to register user' });
  }
}
