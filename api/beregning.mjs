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

  // Modtag alle data fra klienten
  const { task, frequency, duration, role, value, date, email, sendMail, monthlyCost, yearlyCost, monthlyHours } = req.body;

  try {
    // GEM I AIRTABLE
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
              ...(monthlyHours ? { "Timer pr måned": monthlyHours } : {})
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

    // --- MAIL TIL BRUGER HVIS EMAIL ER ANGIVET ---
    if (sendMail && email) {
      await resend.emails.send({
        from: 'PinelBot <kontakt@pinel.dk>',
        to: email,
        subject: 'Din PinelBot-beregning',
        html: `
        <div style="max-width:480px;margin:0 auto;background:#fffbe5;border-radius:13px;padding:28px 24px 16px 24px;font-family:sans-serif;">
          <img src="https://pinelbot.vercel.app/pinelmail.png" alt="Pinel" style="height:32px; margin-bottom:13px;"/>
          <h2 style="color:#363100;font-size:23px;margin-bottom:7px;">Din beregning fra PinelBot</h2>
          <div style="color:#353000;font-size:16px;margin-bottom:13px;">
            Hej! Her er din beregning:<br>
          </div>
          <div style="background:#fffbe5;padding:14px 14px 14px 17px;border-radius:12px;font-size:16px;color:#333;font-weight:500;margin-bottom:13px;box-shadow:0 1px 8px #ffe0703a;">
            <ul style="list-style:none;padding:0;margin:0 0 0 3px;line-height:1.7;">
              <li><b>Opgave:</b> ${task}</li>
              <li><b>Frekvens:</b> ${frequency} gange/uge</li>
              <li><b>Varighed:</b> ${duration} min/gang</li>
              <li><b>Rolle:</b> ${role}</li>
              <li><b>Gevinst:</b> ${value}</li>
              <li><b>Tid pr. måned:</b> ${monthlyHours} timer</li>
              <li><b>Omkostning pr. måned:</b> ${monthlyCost?.toLocaleString?.() || monthlyCost} kr.</li>
              <li><b>Omkostning pr. år:</b> ${yearlyCost?.toLocaleString?.() || yearlyCost} kr.</li>
            </ul>
          </div>

          <div style="margin:24px 0 18px 0;text-align:center;">
            <a href="https://storage.googleapis.com/mailerlite-uploads-prod/1590481/FHi2v0zyYiCUUytEYRdmQBv1tVtFFbG4COU3MRlj.pdf" target="_blank" style="text-decoration:none;">
              <img src="https://pinelbot.vercel.app/ai-guide-banner.png"
                alt="Gratis AI-guide til små virksomheder"
                style="max-width:100%;height:auto;border-radius:12px;box-shadow:0 2px 8px rgba(220,190,67,0.13);margin-bottom:5px;" />
              <div style="color:#363100;font-size:15px;margin-top:5px;font-weight:600;">Få AI-guiden som PDF</div>
            </a>
          </div>

          <div style="margin:18px 0 0 0;font-size:15px;line-height:1.5;color:#5f5907;">
            Har du spørgsmål, eller vil du høre mere om mulighederne?<br>
            Svar direkte på denne mail eller <a href="https://pinel.dk" style="color:#d3b301;text-decoration:none;">besøg pinel.dk</a>
          </div>

          <div style="margin-top:24px;font-size:13px;color:#bab059;">Denne mail er sendt automatisk af PinelBot 🤖</div>
        </div>
        `
      });
    }

    // --- MAIL TIL DIG (ALTID) ---
    await resend.emails.send({
      from: 'PinelBot <kontakt@pinel.dk>',
      to: 'kontakt@pinel.dk',
      subject: '🧮 Ny beregning fra PinelBot',
      html: `
      <div style="max-width:460px;font-family:sans-serif;background:#f9f7eb;padding:22px 17px 14px 19px;border-radius:11px;">
        <img src="https://pinelbot.vercel.app/pinelmail.png" alt="Pinel" style="height:24px; margin-bottom:10px;" />
        <h3 style="margin:0 0 11px 0;font-size:18px;font-weight:600;color:#332e07;">Ny beregning fra PinelBot</h3>
        <ul style="margin:0 0 5px 2px;padding:0;list-style:none;line-height:1.65;">
          <li><b>Opgave:</b> ${task}</li>
          <li><b>Frekvens:</b> ${frequency} gange/uge</li>
          <li><b>Varighed:</b> ${duration} min/gang</li>
          <li><b>Rolle:</b> ${role}</li>
          <li><b>Gevinst:</b> ${value}</li>
          <li><b>Tid pr. måned:</b> ${monthlyHours} timer</li>
          <li><b>Omkostning pr. måned:</b> ${monthlyCost?.toLocaleString?.() || monthlyCost} kr.</li>
          <li><b>Omkostning pr. år:</b> ${yearlyCost?.toLocaleString?.() || yearlyCost} kr.</li>
          ${email ? `<li><b>Email (kunde):</b> ${email}</li>` : ""}
        </ul>
        <div style="margin-top:14px;font-size:13px;color:#aca449;">Sendt: ${date}</div>
      </div>
      `
    });

    console.log('✅ Beregning gemt i Airtable og mails sendt');
    res.status(200).json({ message: 'Beregning gemt og mails sendt', airtableId: data.records[0].id });
  } catch (err) {
    console.error('❌ Server-fejl:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}