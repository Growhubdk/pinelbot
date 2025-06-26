import fetch from 'node-fetch';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    // 1. Gem i Airtable
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
              Message: message
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

    // 2. Send e-mail til dig selv
    await resend.emails.send({
      from: 'PinelBot <no-reply@onresend.com>',
      to: 'kontakt@pinel.dk', // ⬅️ SKIFT TIL DIN ADRESSE
      subject: '🆕 Ny kontakt fra PinelBot',
      html: `
        <h2>Ny besked fra PinelBot</h2>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Besked:</strong></p>
        <p>${message}</p>
      `
    });

    console.log('✅ Airtable + e-mail sendt');
    res.status(200).json({ message: 'Kontakt gemt og e-mail sendt', airtableId: data.records[0].id });
  } catch (err) {
    console.error('❌ Server-fejl:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
