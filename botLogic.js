let activeFlow = null;

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
        addMessage('bot', "👉 Har I arbejdsgange, der gentager sig og kunne automatiseres? (ja/nej)");
      } else if (this.progress === 3) {
        addMessage('bot', "👉 Er I åbne for at afprøve nye digitale værktøjer? (ja/nej)");
      } else {
        const score = this.answers.filter(a => a === 'ja').length;
        let result = score === 3
          ? "💪 I virker meget klar til AI!"
          : score === 2
          ? "🤔 I har potentiale – måske starte småt."
          : "🧭 En snak kunne være godt for at komme i gang.";

        addMessage('bot', `Tak for dine svar 🙌 ${result} Vil du have et konkret forslag baseret på dine svar?`);
        if (typeof addContactButton === 'function') addContactButton();
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
        addMessage('bot', "👉 Bruger I tid på manuelt at trække rapporter, KPI'er eller status? (ja/nej)");
      } else if (this.progress === 3) {
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

  contact: {
    name: "contact",
    state: "idle",
    progress: 0,
    triggers: ["kontakt", "snakke", "skrive", "komme i kontakt"],
    start() {
      this.state = "started";
      this.progress = 1;
      addMessage('bot', "📞 Vil du helst blive ringet op eller skrive en mail? (svar: 'ringe' eller 'mail')");
      persistFlowState(this);
    },
    handle(input) {
      const lower = input.toLowerCase();
      if (lower.includes("ringe")) {
        addMessage('bot', "📱 Du kan blive ringet op via kontaktformularen her: <a href='https://pinel.dk/kontakt' target='_blank'>pinel.dk/kontakt</a>");
      } else if (lower.includes("mail")) {
        addMessage('bot', "✉️ Du kan skrive direkte her: <a href='https://pinel.dk/kontakt' target='_blank'>pinel.dk/kontakt</a>");
      } else {
        addMessage('bot', "Skriv gerne 'ringe' eller 'mail' 🙂");
        return true;
      }
      if (typeof addContactButton === 'function') addContactButton();
      this.reset();
      return true;
    },
    reset() {
      this.state = "idle";
      this.progress = 0;
      activeFlow = null;
      clearFlowState();
    }
  }
};

// === Main logic handler ===
function handleBotLogic(userInput) {
  const input = userInput.toLowerCase();

  if (activeFlow) {
    return flows[activeFlow].handle(input);
  }

  for (const key in flows) {
    const flow = flows[key];
    if (flow.triggers.some(trigger => input.includes(trigger))) {
      activeFlow = flow.name;
      flow.start();
      return true;
    }
  }

  if (input === "ja tak") {
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
    }
  } catch (e) {
    console.error("Kunne ikke loade gemt flow:", e);
  }
}

function clearFlowState() {
  localStorage.removeItem("activeFlow");
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
    if (flow) flow.handle("");
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