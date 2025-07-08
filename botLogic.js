// === GLOBAL STATE ===
let activeFlow = null;

function addContactButton() {
  const wrapper = document.createElement('div');
  wrapper.className = 'option-container';

  const contactBtn = document.createElement('button');
  contactBtn.innerText = "Kontakt Carsten";
  contactBtn.className = 'option-button';
  contactBtn.onclick = () => {
    wrapper.remove();
    activeFlow = "kontakt";
    flows.kontakt.start();
  };

  wrapper.appendChild(contactBtn);
  document.getElementById('messages').appendChild(wrapper);
}

const flows = {
  aiTest: {
    name: "aiTest",
    state: "idle",
    progress: 0,
    answers: [],
    triggers: ["ai-paratheds-test", "ai test", "klarhedstjek", "klar til ai", "vi er klar"],
    start() {
      this.state = "started";
      this.progress = 1;
      this.answers = [];
      addMessage('bot', "✅ Lad os tage AI-paratheds-testen\n👉 Har I allerede brugt AI i jeres virksomhed – bare lidt? (ja/nej)");
      persistFlowState(this);
    },
    handle(input) {
      const normalized = input.toLowerCase();
      if (normalized !== "ja" && normalized !== "nej") {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
      this.answers.push(normalized);
      this.progress++;
      persistFlowState(this);

      if (this.progress === 2) {
  addMessage('bot', "Spørgsmål 2 af 3:");
  addMessage('bot', "👉 Har I arbejdsgange, der gentager sig og kunne automatiseres? (ja/nej)");
} else if (this.progress === 3) {
  addMessage('bot', "Spørgsmål 3 af 3:");
  addMessage('bot', "👉 Er I åbne for at afprøve nye digitale værktøjer? (ja/nej)");
} else {
  const score = this.answers.filter(a => a === 'ja').length;
  let result = score === 3
    ? "💪 I virker meget klar til AI!"
    : score === 2
    ? "🤔 I har potentiale – måske starte småt."
    : "🧭 En snak kunne være godt for at komme i gang.";
  addMessage('bot', `Tak for dine svar 🙌 ${result}`);

  // Tilføj denne blok for at vise CTA-knap:
  addMessage('bot', `
  <div class="result-card" style="background:#fff6d5; text-align:center; margin-top:14px;">
    <b>Vil du have 30 minutters gratis afklaring på, hvad I kan bruge AI til?</b><br>
    <button class="cta-knap" onclick="handleSimulatedUserInput('Book gratis afklaring')">Book gratis afklaring</button>
  </div>
`);


  showFeedback();   // Feedback vises EFTER knappen
  this.reset();
}

      return true;
    },
    reset() {
      this.state = "idle";
      this.progress = 0;
      this.answers = [];
      activeFlow = null;
      clearFlowState();
    }
  },

  automation: {
    name: "automation",
    state: "idle",
    progress: 0,
    answers: [],
    triggers: ["automatisering", "effektivisere", "gentagne opgaver"],
    start() {
      this.state = "started";
      this.progress = 1;
      this.answers = [];
      addMessage('bot', "⚙️ Lad os tale automatisering!\n👉 Har I manuelle opgaver I gentager ofte? (ja/nej)");
      persistFlowState(this);
    },
    handle(input) {
      const normalized = input.toLowerCase();
      if (normalized !== "ja" && normalized !== "nej") {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
      this.answers.push(normalized);
      this.progress++;
      persistFlowState(this);

      if (this.progress === 2) {
        addMessage('bot', "👉 Er der data involveret – fx Excel, mails, formularer? (ja/nej)");
      } else if (this.progress === 3) {
        addMessage('bot', "👉 Er I åbne for at spare tid via automatisering? (ja/nej)");
      } else {
        const score = this.answers.filter(a => a === 'ja').length;
        let result = score === 3
          ? "🚀 I har stort potentiale for automatisering!"
          : score === 2
          ? "🔍 Der er noget at hente – start småt."
          : "📌 Det lyder ikke som et akut behov lige nu.";
        addMessage('bot', `${result} Skal jeg vise et eksempel?`);
        if (typeof addContactButton === 'function') addContactButton();
        showFeedback();
        this.reset();

      }
      return true;
    },
    reset() {
      this.state = "idle";
      this.progress = 0;
      this.answers = [];
      activeFlow = null;
      clearFlowState();
    }
  },

  marketing: {
    name: "marketing",
    state: "idle",
    progress: 0,
    answers: [],
    triggers: ["marketing", "kampagne", "annoncering", "leads", "mailchimp", "google ads", "sociale medier"],
    start() {
      this.state = "started";
      this.progress = 1;
      this.answers = [];
      addMessage('bot', "📣 Skal vi se på AI i marketing?\n👉 Har I manuelle opgaver som fx kampagneopsætning, nyhedsbreve eller annoncering? (ja/nej)");
      persistFlowState(this);
    },
    handle(input) {
      const normalized = input.toLowerCase();
      if (normalized !== "ja" && normalized !== "nej") {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
      this.answers.push(normalized);
      this.progress++;
      persistFlowState(this);

      if (this.progress === 2) {
        addMessage('bot', "👉 Bruger I værktøjer som Mailchimp, Google Ads eller LinkedIn? (ja/nej)");
      } else if (this.progress === 3) {
        addMessage('bot', "👉 Tænker I, at AI kunne hjælpe med at gøre marketing hurtigere eller mere effektiv? (ja/nej)");
      } else {
        const score = this.answers.filter(a => a === 'ja').length;
        let result = score === 3
          ? "🚀 AI kan hjælpe med kampagner, tekster og analyser."
          : score === 2
          ? "🔍 Vi kan starte med fx e-mails eller lead flows."
          : "🧭 Vi kan tage en snak og finde en god indgang.";
        addMessage('bot', `${result} Vil du se et eksempel?`);
        if (typeof addContactButton === 'function') addContactButton();
        showFeedback();
        this.reset();

      }
      return true;
    },
    reset() {
      this.state = "idle";
      this.progress = 0;
      this.answers = [];
      activeFlow = null;
      clearFlowState();
    }
  },

  dataAnalysis: {
    name: "dataAnalysis",
    state: "idle",
    progress: 0,
    answers: [],
    triggers: ["dataanalyse", "analyse", "rapporter", "kpi", "dashboard", "indsigt", "excel", "budget", "crm"],
    start() {
      this.state = "started";
      this.progress = 1;
      this.answers = [];
      addMessage('bot', "📊 Skal vi kigge på dataanalyse?\n👉 Har I data liggende i fx Excel, CRM-systemer eller lignende? (ja/nej)");
      persistFlowState(this);
    },
    handle(input) {
      const normalized = input.toLowerCase();
      if (normalized !== "ja" && normalized !== "nej") {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
      this.answers.push(normalized);
      this.progress++;
      persistFlowState(this);

      if (this.progress === 2) {
  addMessage('bot', "Spørgsmål 2 af 3:");
  addMessage('bot', "👉 Bruger I tid på manuelt at trække rapporter, KPI'er eller status? (ja/nej)");
} else if (this.progress === 3) {
  addMessage('bot', "Spørgsmål 3 af 3:");
  addMessage('bot', "👉 Kunne I tænke jer et simpelt visuelt overblik fx hver uge? (ja/nej)");
} else {
        const score = this.answers.filter(a => a === 'ja').length;
        let result = score === 3
          ? "📈 AI kan automatisere jeres datarapporter og dashboards."
          : score === 2
          ? "🔍 Vi kan starte med én rapport og se værdien."
          : "🧭 Det lyder ikke som et behov lige nu – måske senere.";
        addMessage('bot', `${result} Skal jeg vise et eksempel?`);
        if (typeof addContactButton === 'function') addContactButton();
        showFeedback();
        this.reset();

      }
      return true;
    },
    reset() {
      this.state = "idle";
      this.progress = 0;
      this.answers = [];
      activeFlow = null;
      clearFlowState();
    }
  },

  kontakt: {
  name: "kontakt",
  triggers: [
    "kontakt", "kontakte", "kontaktes", "i kontakt", "kontakt carsten",
    "snakke med", "tale med", "jeg vil gerne kontaktes",
    "jeg vil i kontakt", "jeg vil gerne i kontakt med carsten",
    "personlig sparring", "blive kontaktet"
  ],
  progress: 0,
  state: { awaiting: false },
  answers: {},

  start() {
  this.reset(false); // behold activeFlow
  activeFlow = this.name;
  this.state.awaiting = true;
  const self = this;

  addMessage('bot', "📞 Vil du gerne have personlig AI-sparring?");
  showOptions([
    { label: "✅ Ja tak", value: "ja" },
    { label: "🔙 Nej, ikke lige nu", value: "nej" }
  ], (val) => {
    if (val === "ja") {
      self.progress = 1;
      self.next();
    } else {
      addMessage('bot', "Alt godt – sig til, hvis du får brug for sparring!");
      clearFlowState();
      showTopicButtons();
      self.reset(); // her fjerner vi activeFlow
    }
  });
},



  next() {
  switch (this.progress) {
    case 1:
      console.log("💡 Kontaktflow aktiv? ", activeFlow, this.progress);
      setTimeout(() => {
        this.state.awaiting = true;
        addMessage('bot', "Hvad hedder du?");
        waitForUserInput((name) => {
          if (!name || name.trim().length < 2) {
            addMessage('bot', "⚠️ Skriv venligst dit navn – bare fornavn er fint 😊");
            this.progress = 1;
            this.next();
            return;
          }
          this.answers.name = name.trim();
          this.progress = 2;
          persistFlowState(this);
          this.next();
        });
      }, 300);
      break;

    case 2:
      setTimeout(() => {
        this.state.awaiting = true;
        addMessage('bot', "Og hvilken e-mail kan vi kontakte dig på?");
        waitForUserInput((email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            addMessage('bot', "⚠️ Det ligner ikke en gyldig e-mailadresse. Prøv igen 🙏");
            this.progress = 2;
            this.next();
            return;
          }
          this.answers.email = email.trim();
          this.progress = 3;
          persistFlowState(this);
          this.next();
        });
      }, 300);
      break;

    case 3:
      setTimeout(() => {
        this.state.awaiting = true;
        addMessage('bot', "Er der noget specifikt, du gerne vil spørge om?");
        waitForUserInput((msg) => {
          if (!msg || msg.trim().length < 10) {
            addMessage('bot', "✏️ Skriv gerne lidt mere, så vi kan hjælpe bedst muligt 🙏");
            this.progress = 3;
            this.next();
            return;
          }
          this.answers.message = msg.trim();
          this.progress = 4;
          persistFlowState(this);
          this.next();
        });
      }, 300);
      break;

    case 4:
  fetch("/api/kontakt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: this.answers.name,
      email: this.answers.email,
      message: this.answers.message
    })
  })
  .then(res => res.text()) // 👈 brug .text() fordi Google Scripts returnerer rå tekst som "OK"
  .then(txt => {
    console.log("✅ Webhook response:", txt);
    addMessage('bot', `Tak for din besked, ${this.answers.name} 😊\nJeg har givet den videre til Carsten hos Pinel – han tager den derfra.\n\nDu hører fra os på mail snarest muligt.\n\nBedste hilsner\nPinelbotten 🤖`);
    showFeedback();
    clearFlowState();
    showTopicButtons();
    this.reset();
  })
  .catch(err => {
    console.error("❌ Webhook error:", err);
    addMessage('bot', "⚠️ Noget gik galt – prøv igen senere eller send os en mail.");
  });

  break;

  }
},


  handle(input) {
    const lower = input.toLowerCase();

    if (this.progress === 0 && ["ja", "ja tak"].includes(lower)) {
      this.progress = 1;
      this.next();
      return true;
    }

    if (this.state.awaiting) return true;

    // Hvis alt ellers ser fint ud og brugeren skriver noget midt i flowet
    this.next();
    return true;
  },

  reset(clearActive = true) {
  this.progress = 0;
  this.state = { awaiting: false };
  this.answers = {};
  if (clearActive) activeFlow = null;
  persistFlowState(this);
}
}
};

// === 📈 Beregningsflow – PinelBot Calculator ===
async function startCalculatorFlow() {
  addMessage('bot', "Lad os regne på det 📊 Jeg stiller dig nogle hurtige spørgsmål.");

  // 1. Hent svar fra brugeren
  addMessage('bot', "Spørgsmål 1 af 5:");
const task = await waitForUserText("1️⃣ Hvilken opgave vil du gerne spare tid på?");
  addMessage('bot', "Spørgsmål 2 af 5:");
const frequency = parseInt(await waitForUserText("2️⃣ Hvor mange gange om ugen udfører du denne opgave?"));

addMessage('bot', "Spørgsmål 3 af 5:");
const duration = parseInt(await waitForUserText("3️⃣ Hvor mange minutter tager det hver gang?"));

  addMessage('bot', "Spørgsmål 4 af 5:");
const role = await waitForUserChoice("4️⃣ Hvem laver opgaven oftest?", ["Mig selv", "En kollega", "En ekstern"]);

  addMessage('bot', "Spørgsmål 5 af 5:");
const value = await waitForUserChoice("5️⃣ Hvad vil det vigtigste resultat være for dig?", ["Spare tid", "Undgå fejl", "Få overblik", "Noget andet"]);

// === Gem beregningssvar i Airtable ===
fetch('/api/beregning', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task,
    frequency,
    duration,
    role,
    value,
    date: new Date().toISOString()
  })
});

  // 2. Beregn
  const hourlyRate = role === "Mig selv" ? 600 : role === "En kollega" ? 400 : 700;
  const monthlyHours = (frequency * duration * 4) / 60;
  const monthlyCost = Math.round(monthlyHours * hourlyRate);
  const yearlyCost = monthlyCost * 12;

  // 3. Vis resultatet i et “kort”
  addMessage(
    'bot',
    `<div class="result-card">
      <b>📊 Din beregning:</b><br><br>
      <b>Opgave:</b> ${task}<br>
      <b>Frekvens:</b> ${frequency} gange/uge<br>
      <b>Varighed:</b> ${duration} min/gang<br>
      <b>Rolle:</b> ${role}<br>
      <b>Gevinst:</b> ${value}<br><br>
      <b>⏰ Tid pr. måned:</b> ${monthlyHours.toFixed(1)} timer<br>
      <b>💸 Omkostning pr. måned:</b> ${monthlyCost.toLocaleString()} kr.<br>
      <b>💰 Omkostning pr. år:</b> ${yearlyCost.toLocaleString()} kr.
      <br><span style="color:#9b9600; font-size:0.97em;">Tip: Du kan altid kopiere teksten hvis du vil gemme din beregning.</span>
    </div>`
  );

  // --- SPØRG OM MAIL ---
await new Promise((resolve) => {
  addMessage('bot', "Vil du have din beregning tilsendt på e-mail?");
  showOptions([
    { label: "✅ Ja tak", value: "ja" },
    { label: "Nej tak", value: "nej" }
  ], async (valg) => {
    if (valg === "ja") {
      const email = await waitForUserText("Skriv din e-mail her:");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        addMessage('bot', "Det ligner ikke en gyldig e-mailadresse. Prøv igen:");
        resolve();
        return;
      }
      // Send HELE beregningen til backend
      fetch('/api/beregning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          frequency,
          duration,
          role,
          value,
          date: new Date().toISOString(),
          email,
          sendMail: true,
          monthlyHours: monthlyHours.toFixed(1),
          monthlyCost,
          yearlyCost
        })
      });
      addMessage('bot', "✔️ Din beregning er sendt til din e-mail. Tjek evt. din spam-mappe.");
      resolve();
    } else {
      addMessage('bot', "Intet problem! Du kan altid kopiere beregningen herfra.");
      resolve();
    }
  });
});


  // 4. Inviter brugeren videre – uden at lukke samtalen ned
await new Promise((resolve) => {
  showOptions([
    { label: "Prøv med en anden opgave", value: "ny" },
    { label: "Tal med Carsten om muligheder", value: "kontakt" },
    { label: "Tilbage til hovedmenu", value: "tilbage" }
  ], (valg) => {
    if (valg === "ny") {
      showFeedback();           // <-- VIS FEEDBACK FØR NYT BEREGNING
      startCalculatorFlow();    // Start flowet forfra
      resolve();
    } else if (valg === "kontakt") {
      addMessage('bot', "Super! Jeg sætter dig straks i kontakt med Carsten. 👋");
      if (typeof flows.kontakt?.start === 'function') {
        activeFlow = "kontakt";
        flows.kontakt.start();
      }
      showFeedback();           // <-- VIS FEEDBACK
      resolve();
    } else {
      addMessage('bot', "Du kan vælge et nyt emne nedenfor eller stille et nyt spørgsmål. Jeg er klar til at hjælpe videre!");
      showFeedback();           // <-- VIS FEEDBACK
      showTopicButtons();
      resolve();
    }
  });
});

}




// === Main logic handler ===
async function handleBotLogic(userInput) {
  const input = userInput.toLowerCase();
  console.log("🔍 ActiveFlow:", activeFlow, "| Input:", input);

  // 🔄 Beskyt mod gentagelse hvis brugeren allerede er i et flow og nævner det igen
  const flowAlias = {
    kontakt: ["kontakt", "kontakte", "kontaktes", "i kontakt", "snakke med", "tale med", "carsten", "personlig sparring", "blive kontaktet"],
    automation: ["automatisering", "automatisere", "effektivisere", "gentagne opgaver"],
    aiTest: ["ai test", "ai-parathed", "paratheds-test", "klar til ai", "vi er klar"],
    marketing: ["marketing", "kampagne", "annoncering", "leads", "mailchimp", "google ads", "sociale medier"],
    dataAnalysis: ["data", "analyse", "dashboard", "rapporter", "kpi", "excel", "crm"]
  };

  if (activeFlow && flows[activeFlow]?.progress > 0) {
    const keywords = flowAlias[activeFlow] || [];
    if (keywords.some(k => input.includes(k))) {
      addMessage('bot', "Bare rolig – vi er allerede i gang med det emne 😊");
      return true;
    }
  }
  

  // ✅ Hvis brugeren tydeligt vil i kontakt med Carsten uanset aktivt flow
  const kontaktOrd = ["kontakt", "carsten", "blive kontaktet", "snakke med", "personlig sparring", "tage kontakt"];
if (kontaktOrd.some(k => input.includes(k))) {
  if (activeFlow === "kontakt" && flows.kontakt.progress > 0) {
    addMessage('bot', "Bare rolig – vi er allerede i gang med at få dig i kontakt med Carsten 😊");
    return true;
  }
  activeFlow = "kontakt";
  flows.kontakt.start();
  return true;
}

  // 💬 Behandl aktivt flow
  if (activeFlow) {
    const flow = flows[activeFlow];
    if (flow.state.awaiting) return true;

    // Beskyt mod dobbelt trigger af case 0 i kontakt-flow
    if (flow.name === "kontakt" && flow.progress === 0 && input !== "ja" && input !== "ja tak") return true;

    return flow.handle(input);
  }

  // 🚀 Start nyt flow baseret på trigger
  for (const key in flows) {
    const flow = flows[key];
    if (flow.triggers && flow.triggers.some(trigger => input.includes(trigger))) {
      activeFlow = flow.name;
      flow.start();
      return true;
    }
  }

  // 🎯 Tilfælde: bruger skriver 'ja tak' uden flow
  if (!activeFlow && input === "ja tak") {
    addMessage('bot', "Her er et konkret forslag:");
    if (flows.automation.answers.length > 0) {
      addMessage('bot', "⚙️ Start med at automatisere én manuel opgave – fx at flytte data mellem Excel og mails.");
    } else if (flows.aiTest.answers.length > 0) {
      addMessage('bot', "🤖 Start med et lille AI-projekt – fx automatisk sortering af mails eller tilbudsgenerering.");
    } else {
      addMessage('bot', "🔍 Vi kan starte med en kort analyse af jeres arbejdsgange og finde lavthængende frugter.");
    }
    addMessage('bot', "Vil du tage en snak om det? Så klik herunder 👇");
    if (typeof addContactButton === 'function') addContactButton();
    return true;
  }

  // 📈 Beregningsflow
if (input.includes("beregne") || input.includes("besparelse") || input.includes("spare tid")) {
  if (typeof startCalculatorFlow === 'function') {
    startCalculatorFlow();
    return true;
  } else {
    addMessage('bot', "🔧 Beregningsværktøjet er ikke aktiveret endnu.");
    return true;
  }
}

  return false;
}




// === Gem og hent samtalestatus ===
function persistFlowState(flow) {
  const data = {
    name: flow.name,
    progress: flow.progress,
    answers: flow.answers,
    state: flow.state
  };
  localStorage.setItem("activeFlow", JSON.stringify(data));
}

function loadFlowState() {
  const raw = localStorage.getItem("activeFlow");
  if (!raw) return;
  try {
    const saved = JSON.parse(raw);
    const flow = flows[saved.name];
    if (flow) {
      flow.state = saved.state;
      flow.progress = saved.progress;
      flow.answers = saved.answers;
      activeFlow = saved.name;
      addMessage('bot', `📌 Du havde et flow i gang sidst: *${saved.name}*.\nVil du fortsætte, hvor du slap?`);
      showResumeButtons();
      scrollToBottom();
    }
  } catch (e) {
    console.error("Kunne ikke loade gemt flow:", e);
  }
}

function clearFlowState() {
  localStorage.removeItem("activeFlow");
}

// 💡 Ny helper-funktion
function handleNextStep(flow) {
  flow.state.awaiting = false;
  flow.handle("");
}

function showResumeButtons() {
  const wrapper = document.createElement('div');
  wrapper.className = 'option-container';

  const yesBtn = document.createElement('button');
  yesBtn.innerText = "✅ Ja tak";
  yesBtn.className = 'option-button';
  yesBtn.onclick = () => {
    wrapper.remove();
    const flow = flows[activeFlow];
    // Brug næste-step logik!
    if (flow && typeof flow.next === 'function') flow.next();
    else if (flow) flow.handle("");
  };

  const noBtn = document.createElement('button');
  noBtn.innerText = "🔄 Nej, start forfra";
  noBtn.className = 'option-button';
  noBtn.onclick = () => {
    wrapper.remove();
    if (activeFlow && flows[activeFlow]) {
      flows[activeFlow].reset();
    }
    addMessage('bot', '🧠 Klar til et nyt emne? Hvad vil du gerne vide mere om?');
    showTopicButtons();
  };

  wrapper.appendChild(yesBtn);
  wrapper.appendChild(noBtn);
  document.getElementById('messages').appendChild(wrapper);
}



