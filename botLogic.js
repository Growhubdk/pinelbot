
let messageCount = 0;
let offeredTest = false;
let inTestMode = false;
let awaitingEmail = false;

function handleBotLogic(userInput) {
  if (inTestMode || awaitingEmail) return true;
  if (inTestMode || awaitingEmail) return;

  messageCount++;
if (userInput.toLowerCase().includes('er jeg klar')) {
    setTimeout(() => {
      addMessage('bot', 'Vil du tage en hurtig AI-paratheds-test og få et forslag? Skriv "ja" eller "nej".');
    }, 1000);
    offeredTest = true;
    return true;
  }

  if (!offeredTest && messageCount >= 3) {
    offeredTest = true;
    setTimeout(() => {
      addMessage('bot', 'Vil du tage en hurtig AI-paratheds-test? Skriv "ja" eller "nej".');
    }, 1000);
  }

  if (userInput.toLowerCase().includes('test') || userInput.toLowerCase().includes('parathed')) {
    startAIAssessment();
    return true;
  }

  if (userInput.toLowerCase() === 'ja') {
    startAIAssessment();
    return true;
  }
}

function startAIAssessment() {
  inTestMode = true;
  const questions = [
    "Har I allerede brugt AI i jeres virksomhed – bare lidt?",
    "Har I manuelle opgaver, der er gentagende og frustrerende?",
    "Har I adgang til data – fx Excel-ark, CRM, mails?"
  ];
  let answers = [];
  let qIndex = 0;

  const askNext = () => {
    if (qIndex < questions.length) {
      addMessage('bot', questions[qIndex]);
      waitForAnswer().then(answer => {
        answers.push(answer);
        qIndex++;
        askNext();
      });
    } else {
      summarizeAssessment(answers);
    }
  };

  askNext();
}

function waitForAnswer() {
  return new Promise(resolve => {
    const handler = (e) => {
      if (e.key === 'Enter') {
        const input = e.target.value.trim();
        if (!input) return;
        e.target.value = '';
        addMessage('user', input);
        document.getElementById('user-input').removeEventListener('keypress', handler);
        resolve(input);
      }
    };
    document.getElementById('user-input').addEventListener('keypress', handler);
  });
}

function summarizeAssessment(answers) {
  inTestMode = false;
  const score = answers.filter(a => a.toLowerCase().includes('ja')).length;
  let summary = "";

  if (score === 3) {
    summary = "Det lyder som om I er godt på vej! I har både erfaring, behov og data – det er en stærk kombination.";
  } else if (score === 2) {
    summary = "Der er klart potentiale! Det kunne være oplagt at starte med en workshop og se hvor AI kan gøre en forskel.";
  } else {
    summary = "Der er måske lidt vej endnu – men vi kan sagtens tage en snak om, hvor det giver mening at starte.";
  }

  addMessage('bot', summary + ' 👉 <a href="https://pinel.dk/kontakt" target="_blank">Kontakt mig her</a>.');
  setTimeout(() => {
    addMessage('bot', "Vil du have resultatet og et par forslag sendt til din mail? Skriv din e-mailadresse her:");
    awaitingEmail = true;
    waitForAnswer().then(email => {
      if (email.includes('@') && email.includes('.')) {
        addMessage('bot', "Tak – jeg sender dig en opsummering snarest. Du hører fra mig på kontakt@pinel.dk.");
        sendEmailToFormspree(email);
      } else {
        addMessage('bot', "Hmm, det ser ikke ud som en gyldig e-mail. Prøv igen?");
        awaitingEmail = false;
      }
    });
  }, 1500);
}

function sendEmailToFormspree(email) {
  fetch("https://formspree.io/f/xdkgqnyw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email })
  })
  .then(res => {
    if (!res.ok) throw new Error("Netværksfejl");
    awaitingEmail = false;
  })
  .catch(() => {
    addMessage('bot', "Noget gik galt med at sende e-mailen. Du kan også skrive direkte til kontakt@pinel.dk.");
    awaitingEmail = false;
  });
}
