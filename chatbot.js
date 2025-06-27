const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
let userMessageCount = 0;
let topicChosen = false;

// Global ventefunktion til brugerinput
let awaitingUserInputCallback = null;

function waitForUserInput(callback) {
  console.log("🟡 Bot venter på brugerinput...");
  awaitingUserInputCallback = callback;

  // ✅ Sørg for at brugeren kan skrive
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

function addMessage(sender, text) {
  const msg = document.createElement('div');

  if (sender === 'bot') {
    const wrapper = document.createElement('div');
    wrapper.className = 'bot-wrapper'; // ny wrapper til layout

    const logo = document.createElement('img');
    logo.src = 'pinelchatbot.png'; // sørg for at den ligger i projektets rod
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

  messagesDiv.appendChild(msg);
  scrollToBottom();
}


function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'bubble bot-bubble typing';
  typing.id = 'typing-indicator';
  typing.innerText = 'PinelBot skriver...';
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
  const topics = [
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
  if (typeof handleBotLogic === 'function') {
    const handled = handleBotLogic(text);
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

  const raw = localStorage.getItem("activeFlow");
  if (!raw) {
    addMessage('bot', 'Hej 👋 Jeg er PinelBot – din jordnære AI-rådgiver. Hvad vil du gerne vide mere om?');
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
    const handled = handleBotLogic(userText);
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