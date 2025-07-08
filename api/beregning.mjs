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

  // Træk ALT ud fra body (inkl. e-mail & beregningstal hvis medsendt)
  const {
    task, frequency, duration, role, value, date,
    email, sendMail,
    monthlyHours, monthlyCost, yearlyCost
  } = req.body;

  try {
    // 1. Gem i Airtable (udvid med evt. e-mail)
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
              Date: date,
              ...(email ? { Email: email } : {}),
              ...(monthlyCost ? { "Månedlig omkostning": monthlyCost } : {}),
              ...(yearlyCost ? { "Årlig omkostning": yearlyCost } : {}),
              ...(monthlyHours ? { "Timer pr måned": Number(monthlyHours) } : {})
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

    // 2. Send notifikationsmail til dig selv (altid!)
    await resend.emails.send({
      from: 'PinelBot <kontakt@pinel.dk>',
      to: 'kontakt@pinel.dk',
      subject: '🧮 Ny beregning fra PinelBot',
      html: `
        <img src="https://pinelbot.vercel.app/pinelmail.png" alt="Pinel logo" width="120" style="display:block;margin-bottom:16px;">
        <h2>Ny beregning fra PinelBot</h2>
        <ul style="font-size:16px;line-height:1.7">
          <li><strong>Opgave:</strong> ${task}</li>
          <li><strong>Frekvens:</strong> ${frequency} gange/uge</li>
          <li><strong>Varighed:</strong> ${duration} min/gang</li>
          <li><strong>Rolle:</strong> ${role}</li>
          <li><strong>Gevinst:</strong> ${value}</li>
          ${monthlyHours ? `<li><strong>Tid pr. måned:</strong> ${monthlyHours} timer</li>` : ""}
          ${monthlyCost ? `<li><strong>Omkostning pr. måned:</strong> ${monthlyCost.toLocaleString()} kr.</li>` : ""}
          ${yearlyCost ? `<li><strong>Omkostning pr. år:</strong> ${yearlyCost.toLocaleString()} kr.</li>` : ""}
          ${email ? `<li><strong>E-mail fra bruger:</strong> ${email}</li>` : ""}
        </ul>
        <p><em>Sendt: ${date}</em></p>
      `
    });

    // 3. Hvis kunden har valgt "send til min e-mail", så send branded mail til dem:
    if (sendMail && email) {
      await resend.emails.send({
        from: 'PinelBot <kontakt@pinel.dk>',
        to: email,
        subject: 'Din beregning fra PinelBot',
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif; background:#fffbe5; border-radius:12px; border:1px solid #ffe070; padding:26px 20px; max-width:440px; margin:0 auto;">
            <img src="https://pinelbot.vercel.app/pinelmail.png" alt="Pinel logo" width="140" style="display:block;margin:0 auto 18px auto;">
            <h2 style="font-size:21px; color:#3d3400; font-weight:700; margin-bottom:8px;">Din PinelBot-beregning</h2>
            <p style="font-size:16px; margin-bottom:14px;">Hej! Her er din beregning fra PinelBot 👇</p>
            <div style="background:#fff7cf; border-radius:8px; border:1px solid #ffe070; padding:18px 14px;">
              <ul style="font-size:16px;line-height:1.65;padding-left:18px;">
                <li><strong>Opgave:</strong> ${task}</li>
                <li><strong>Frekvens:</strong> ${frequency} gange/uge</li>
                <li><strong>Varighed:</strong> ${duration} min/gang</li>
                <li><strong>Rolle:</strong> ${role}</li>
                <li><strong>Gevinst:</strong> ${value}</li>
                ${monthlyHours ? `<li><strong>Tid pr. måned:</strong> ${monthlyHours} timer</li>` : ""}
                ${monthlyCost ? `<li><strong>Omkostning pr. måned:</strong> ${Number(monthlyCost).toLocaleString()} kr.</li>` : ""}
                ${yearlyCost ? `<li><strong>Omkostning pr. år:</strong> ${Number(yearlyCost).toLocaleString()} kr.</li>` : ""}
              </ul>
            </div>
            <p style="font-size:15px; margin:18px 0 0 0;">Har du spørgsmål, eller vil du høre mere om mulighederne?<br>
            <a href="mailto:kontakt@pinel.dk" style="color:#3d3400; text-decoration:underline;">Skriv til Carsten hos Pinel</a> eller besøg <a href="https://pinel.dk" style="color:#3d3400;text-decoration:underline;">pinel.dk</a></p>
          </div>
        `
      });
    }

    res.status(200).json({ message: 'Beregning gemt og e-mails sendt', airtableId: data.records[0].id });
  } catch (err) {
    console.error('❌ Server-fejl:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}