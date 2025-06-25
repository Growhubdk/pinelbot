import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Kun POST tilladt' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { name, email, message } = req.body;

  try {
    const webhookUrl = "https://script.google.com/macros/s/AKfycbw0wE4-Zvls-FZaUapRbwyNJjjeariWaWhMtvmOvCOijVeQfAoQhf8oNotXW0GT37AI/exec";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.json();
    return res.status(200).json({ status: 'success', result });
  } catch (error) {
    console.error("Webhook-fejl:", error);
    return res.status(500).json({ error: 'Webhook-fejl' });
  }
}