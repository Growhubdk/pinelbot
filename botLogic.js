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
    this.reset();
    activeFlow = this.name;
    this.state.awaiting = true;
    addMessage('bot', "📞 Vil du gerne have personlig AI-sparring?");
    showOptions([
      { label: "✅ Ja tak", value: "ja" },
      { label: "🔙 Nej, ikke lige nu", value: "nej" }
    ], (val) => {
      if (val === "ja") {
        this.progress = 1;
        this.next();
      } else {
        addMessage('bot', "Alt godt – sig til, hvis du får brug for sparring!");
        clearFlowState();
        showTopicButtons();
        this.reset();
      }
    });
  },

  next() {
    this.state.awaiting = true;
    switch (this.progress) {
      case 1:
        addMessage('bot', "Hvad hedder du?");
        waitForUserInput((name) => {
          if (!name || name.trim().length < 2) {
            addMessage('bot', "⚠️ Skriv venligst dit navn – bare fornavn er fint 😊");
            this.next();
            return;
          }
          this.answers.name = name.trim();
          this.progress = 2;
          this.next();
        });
        break;

      case 2:
        addMessage('bot', "Og hvilken e-mail kan vi kontakte dig på?");
        waitForUserInput((email) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            addMessage('bot', "⚠️ Det ligner ikke en gyldig e-mailadresse. Prøv igen 🙏");
            this.next();
            return;
          }
          this.answers.email = email.trim();
          this.progress = 3;
          this.next();
        });
        break;

      case 3:
        addMessage('bot', "Er der noget specifikt, du gerne vil spørge om?");
        waitForUserInput((msg) => {
          if (!msg || msg.trim().length < 10) {
            addMessage('bot', "✏️ Skriv gerne lidt mere, så vi kan hjælpe bedst muligt 🙏");
            this.next();
            return;
          }
          this.answers.message = msg.trim();
          this.progress = 4;
          this.next();
        });
        break;

      case 4:
        fetch("https://script.google.com/macros/s/AKfycbzjTRUHX-kBXVOVil85XaTH555CqwH4hx31B7z-7NlXSgXGT4xQx5TUd-4Uw83q7X3g/exec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.answers.name,
            email: this.answers.email,
            message: this.answers.message
          })
        });
        addMessage('bot', `✅ Tak, ${this.answers.name}! Vi vender tilbage meget snart.`);
        clearFlowState();
        showTopicButtons();
        this.reset();
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

  reset() {
    this.progress = 0;
    this.state = { awaiting: false };
    this.answers = {};
    activeFlow = null;
    persistFlowState(this);
  }
}
};


// === Main logic handler ===
function handleBotLogic(userInput) {
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


