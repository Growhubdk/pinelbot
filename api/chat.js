export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Kun POST tilladt' });
  }

  const userMessage = req.body.message;

  const systemPrompt = `
Du er PinelBot – en jordnær, professionel og venlig AI-rådgiver for pinel.dk.
Svar venligt og præcist, maks. 3 punkter. Brug korte sætninger og konkrete forslag.
Svar kun på spørgsmål relateret til Pinel.dk og henvis til https://pinel.dk/kontakt ved behov for personlig kontakt.

Du tilbyder:
- AI-overblik og analyse
- Automatisering af gentagende opgaver
- Praktisk rådgivning med fokus på værdi
`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await openaiRes.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Noget gik galt med OpenAI-kaldet' });
  }
}