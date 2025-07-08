const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const chatWindow = messagesDiv;
const scrollTopBtn = document.getElementById("scrollTopBtn"); // <-- kun én gang her!
const sendButton = document.getElementById('send-button');
let userMessageCount = 0;
let topicChosen = false;

function focusInput() {
  setTimeout(() => inputField.focus(), 100);
}

// Global ventefunktion til brugerinput
let awaitingUserInputCallback = null;

function waitForUserInput(callback) {
  console.log("🟡 Bot venter på brugerinput...");
  awaitingUserInputCallback = callback;
  inputField.disabled = false;
  sendButton.disabled = false;
  inputField.placeholder = "Skriv din besked her...";
}

function onUserInput(text) {
  if (awaitingUserInputCallback) {
    console.log("Modtager brugerinput:", text);
    const cb = awaitingUserInputCallback;
    awaitingUserInputCallback = null;
    inputField.disabled = false;
    sendButton.disabled = false;
    inputField.placeholder = "Skriv din besked her...";
    cb(text);
    return true;
  }
  return false;
}

function waitForUserText(promptText) {
  return new Promise((resolve) => {
    addMessage('bot', promptText);
    waitForUserInput((input) => {
      resolve(input);
    });
  });
}

function waitForUserChoice(promptText, options) {
  return new Promise((resolve) => {
    addMessage('bot', promptText);

    const wrapper = document.createElement('div');
    wrapper.className = 'option-container';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-button';
      btn.innerText = opt;
      btn.onclick = () => {
        wrapper.remove();
        addMessage('user', opt);
        resolve(opt);
      };
      wrapper.appendChild(btn);
    });

    messagesDiv.appendChild(wrapper);  // <-- RIGTIG HER!
    scrollToBottom();
    focusInput();
  });
}

function addMessage(sender, text) {
  const msg = document.createElement('div');

  if (sender === 'bot') {
    const wrapper = document.createElement('div');
    wrapper.className = 'bot-wrapper';

    const logo = document.createElement('img');
    logo.src = 'pinelchatbot.png';
    logo.alt = 'PinelBot';
    logo.className = 'bot-logo';

    const textElem = document.createElement('div');
    textElem.className = 'bot-bubble';
    textElem.innerHTML = text;

    wrapper.appendChild(logo);
    wrapper.appendChild(textElem);
    msg.appendChild(wrapper);
  } else {
    msg.className = 'bubble user-bubble';
    msg.innerHTML = text;
  }

    messagesDiv.appendChild(msg); // <-- RIGTIG HER!
  scrollToBottom();
  focusInput();

  // GEM BESKEDEN I localStorage
  const chatHistory = JSON.parse(localStorage.getItem('pinelChatHistory') || '[]');
  chatHistory.push({ sender, text });
  localStorage.setItem('pinelChatHistory', JSON.stringify(chatHistory));
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'bubble bot-bubble typing';
  typing.id = 'typing-indicator';

  const label = document.createElement('span');
  label.innerText = 'PinelBot skriver';

  const dots = document.createElement('span');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';

  typing.appendChild(label);
  typing.appendChild(dots);
  messagesDiv.appendChild(typing);
  scrollToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function resetTopicFlow() {
  userMessageCount = 0;
  topicChosen = false;
  clearFlowState();

  const buttons = document.querySelectorAll('.option-container, .topic-button, .option-button, #reset-topic');
  buttons.forEach(btn => btn.remove());

  addMessage('bot', '🔁 Du har skiftet emne. Hvad vil du gerne høre om?');
  showTopicButtons();
}

function showTopicButtons() {
  localStorage.removeItem('pinelChatHistory');
  const topics = [
    { label: '📈 Beregn besparelse', prompt: 'Jeg vil beregne, hvad jeg kan spare' },
    { label: '📊 Rådgivning', prompt: 'Jeg vil gerne have rådgivning' },
    { label: '🤖 Automatisering', prompt: 'Jeg vil gerne automatisere noget' },
    { label: '🧪 AI-parathed', prompt: 'Lad os tage AI-paratheds-testen' },
    { label: '📞 Kontakt', prompt: 'Jeg vil gerne kontaktes' }
  ];

  const wrapper = document.createElement('div');
  wrapper.id = 'topic-buttons';
  wrapper.style.display = 'flex';
  wrapper.style.gap = '10px';
  wrapper.style.marginTop = '10px';
  wrapper.style.flexWrap = 'wrap';

  topics.forEach(t => {
    const btn = document.createElement('button');
    btn.innerText = t.label;
    btn.className = 'topic-button';
    btn.onclick = () => {
      wrapper.remove();
      topicChosen = true;
      addMessage('user', t.prompt);
      handleSimulatedUserInput(t.prompt);
    };
    wrapper.appendChild(btn);
  });

  messagesDiv.appendChild(wrapper);
  scrollToBottom();
}

async function handleSimulatedUserInput(text) {
  // Fang Book gratis afklaring-knappen først!
  if (text === 'Book gratis afklaring') {
    if (typeof flows.kontakt?.start === 'function') {
      activeFlow = "kontakt";
      flows.kontakt.start();
    }
    return; // Stopper funktionen her
  }

  if (typeof handleBotLogic === 'function') {
    const handled = await handleBotLogic(text);
    if (handled) return;
  }

  showTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    removeTypingIndicator();
    addMessage('bot', data.reply);
  } catch (error) {
    removeTypingIndicator();
    addMessage('bot', "Beklager, noget gik galt. Prøv igen senere.");
  }
}

window.onload = () => {
  if (typeof loadFlowState === 'function') {
    loadFlowState();
  }

  // Hent det rå gemte flow-objekt som tekst
  const savedFlowRaw = localStorage.getItem('activeFlow');
  if (savedFlowRaw) {
    // Parse JSON-strengen for at få objektet
    const savedFlow = JSON.parse(savedFlowRaw);
    const flowName = savedFlow.name;  // Hent flow-navnet

    addMessage('bot', `📌 Du havde et flow i gang sidst: *${flowName}*. Vil du fortsætte, hvor du slap?`);
    showOptions([
      { label: '✅ Ja tak', value: 'fortsæt' },
      { label: '🔄 Nej, start forfra', value: 'nyt' }
    ], (valg) => {
      if (valg === 'fortsæt') {
        activeFlow = flowName;
        if (typeof flows[activeFlow]?.resume === 'function') {
          flows[activeFlow].resume();
        } else if (typeof flows[activeFlow]?.start === 'function') {
          flows[activeFlow].start();
        }
      } else {
        localStorage.removeItem('activeFlow');
        localStorage.removeItem('flowState');
        localStorage.removeItem('pinelChatHistory');
        activeFlow = null;
        messagesDiv.innerHTML = '';

        addMessage('bot', "Okay, vi starter forfra. Hvad vil du gerne høre om i dag?");
        showTopicButtons();
      }
    });
    return;
  }

  const chatHistory = JSON.parse(localStorage.getItem('pinelChatHistory') || '[]');
  if (chatHistory.length > 0) {
    chatHistory.forEach(msg => addMessage(msg.sender, msg.text));
  } else {
    addMessage('bot', "Hej og velkommen til PinelBot 👋\nJeg er din hjælper, når det gælder AI, automatisering og smarte løsninger i din virksomhed. Hvad er du mest nysgerrig på i dag?");
    showTopicButtons();
    scrollToBottom();
  }
};



async function handleUserInput() {
  const userText = inputField.value.trim();
  if (!userText) return;
  inputField.value = '';
  addMessage('user', userText);
  userMessageCount++;

  if (!topicChosen) topicChosen = true;

  if (awaitingUserInputCallback && activeFlow && flows[activeFlow]) {
    flows[activeFlow].state.awaiting = false;
  }

  if (onUserInput(userText)) return;

  if (typeof handleBotLogic === 'function') {
    const handled = await handleBotLogic(userText);
    if (handled) return;
  }

  showTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    removeTypingIndicator();
    addMessage('bot', data.reply);

  } catch (error) {
    removeTypingIndicator();
    addMessage('bot', "Beklager, noget gik galt. Prøv igen senere.");
  }
}

inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleUserInput();
});

sendButton.addEventListener('click', () => {
  handleUserInput();
});

function scrollToBottom() {
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ✅ INDSAT HER: showOptions
function showOptions(options, callback) {
  const wrapper = document.createElement('div');
  wrapper.className = 'option-container';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.innerText = opt.label;
    btn.className = 'option-button';
    btn.onclick = () => {
      wrapper.remove();
      callback(opt.value);
    };
    wrapper.appendChild(btn);
  });

  messagesDiv.appendChild(wrapper);
  scrollToBottom();
}

// --- FEEDBACK-KNAPPER --- //
function showFeedback() {
  const wrapper = document.createElement('div');
  wrapper.className = 'option-container';
  
  const prompt = document.createElement('div');
  prompt.style.marginBottom = "6px";
  prompt.style.fontSize = "15px";
  prompt.innerText = "Fik du det, du kom for?";
  wrapper.appendChild(prompt);

  [
    {label: "👍 Ja", value: "ja"},
    {label: "👎 Nej", value: "nej"}
  ].forEach(opt => {
    const btn = document.createElement('button');
    btn.innerText = opt.label;
    btn.className = 'option-button';
    btn.onclick = () => {
      wrapper.remove();
      if (opt.value === "nej") {
        addMessage('bot', "Skriv gerne herunder, hvad du manglede eller havde håbet på – så bliver jeg klogere!");
      } else {
        addMessage('bot', "Tak for din feedback! 🙏 Du kan altid starte et nyt emne eller kontakte Carsten.");
        // Fjernet showTopicButtons!
      }
    };
    wrapper.appendChild(btn);
  });

  messagesDiv.appendChild(wrapper);
  scrollToBottom();
}


// --- SCROLL TO TOP-FUNKTIONALITET ---
messagesDiv.addEventListener("scroll", () => {
  if (messagesDiv.scrollTop > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  messagesDiv.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});