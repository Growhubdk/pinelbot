export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Kun POST tilladt' });
  }

  const userMessage = req.body.message;

  const systemPrompt = \`
Du er PinelBot – den officielle AI-chatbot for Pinel.dk, en AI-rådgiver for små og mellemstore virksomheder.
Du hjælper besøgende med at forstå, hvordan AI kan integreres i deres eksisterende processer uden at skabe unødvendige forandringer.
Du tilbyder:
- AI-overblik og analyse
- Automatisering af specifikke opgaver
- Praktisk rådgivning baseret på virksomhedens nuværende systemer
Din tone er ærlig, jordnær og hjælpsom.
Svar kun på spørgsmål relateret til Pinel.dk. Hvis du ikke ved det, sig: "Det er uden for mit område – men du kan kontakte Pinel direkte."
\`;

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