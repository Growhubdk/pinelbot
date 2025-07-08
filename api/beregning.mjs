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

  const { task, frequency, duration, role, value, date } = req.body;

  try {
    // Gem i Airtable
    const response = await fetch('https://api.airtable.com/v0/appxkynJkBfhXFYd4/PinelbotBeregning', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Task: task,
              Frequency: frequency,
              Duration: duration,
              Role: role,
              Value: value,
              Date: date
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

    // Send mail via Resend
    const mailRes = await resend.emails.send({
      from: 'PinelBot <kontakt@pinel.dk>',
      to: 'kontakt@pinel.dk',
      subject: '🧮 Ny beregning fra PinelBot',
      html: `
        <h2>Ny beregning fra PinelBot</h2>
        <p><strong>Opgave:</strong> ${task}</p>
        <p><strong>Frekvens:</strong> ${frequency} gange/uge</p>
        <p><strong>Varighed:</strong> ${duration} min/gang</p>
        <p><strong>Rolle:</strong> ${role}</p>
        <p><strong>Gevinst:</strong> ${value}</p>
        <p><strong>Dato:</strong> ${date}</p>
      `
    });

    console.log('📬 Resend response:', mailRes);
    console.log('✅ Beregning gemt i Airtable og mail sendt');

    res.status(200).json({ message: 'Beregning gemt og e-mail sendt', airtableId: data.records[0].id });
  } catch (err) {
    console.error('❌ Server-fejl:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}