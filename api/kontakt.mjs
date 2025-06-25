import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, email, message } = req.body;
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch('https://api.airtable.com/v0/appxkynJkBfhXFYd4/Pinelbotkontakt', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: name,
              Email: email,
              Message: message,
              Timestamp: timestamp
            }
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Airtable-fejl:', data);
      return res.status(500).json({ message: 'Airtable error', error: data });
    }

    console.log('✅ Airtable-svar:', data);
    res.status(200).json({ message: 'Kontakt gemt i Airtable', airtableId: data.records[0].id });
  } catch (err) {
    console.error('❌ Server-fejl:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}