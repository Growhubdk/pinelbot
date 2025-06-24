const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const sendButton = document.getElementById('send-button');
let userMessageCount = 0;
let topicChosen = false;

// Global ventefunktion til brugerinput
let awaitingUserInputCallback = null;

function waitForUserInput(callback) {
  awaitingUserInputCallback = callback;
  // Deaktiver input under vent
  inputField.disabled = true;
  sendButton.disabled = true;
  inputField.placeholder = "Vent venligst på spørgsmålet...";
}

function onUserInput(text) {
  if (awaitingUserInputCallback) {
    const cb = awaitingUserInputCallback;
    awaitingUserInputCallback = null;
    // Aktiver input igen
    inputField.disabled = false;
    sendButton.disabled = false;
    inputField.placeholder = "Skriv din besked her...";
    cb(text);
    return true; // Input håndteres som svar
  }
  return false; // Input håndteres normalt
}

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'bubble user-bubble' : 'bubble bot-bubble';
  msg.innerHTML = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'bubble bot-bubble typing';
  typing.id = 'typing-indicator';
  typing.innerText = 'PinelBot skriver...';
  messagesDiv.appendChild(typing);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function showTopicResetButton() {
  if (document.getElementById('reset-topic')) return;

  const button = document.createElement('button');
  button.id = 'reset-topic';
  button.innerText = '🔁 Skift emne';
  button.className = 'reset-button';
  button.onclick = () => {
    userMessageCount = 0;
    topicChosen = false;
    button.remove();
    addMessage('bot', '🧠 Klar til et nyt spor? Hvad vil du gerne høre om?');
    showTopicButtons();
  };

  messagesDiv.appendChild(button);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
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

  // Hvis bot venter på svar, håndter det her:
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

    if (userMessageCount === 3 || userMessageCount === 6) {
      setTimeout(showTopicResetButton, 1000);
    }
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
