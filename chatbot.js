const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const sendButton = document.getElementById('send-button');

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

window.onload = () => {
  addMessage('bot', 'Hej 👋 Jeg er PinelBot – din jordnære AI-rådgiver. Spørg mig om AI, automatisering, eller test hvor klar din virksomhed er til AI. Hvad vil du gerne vide?');
};

async function handleUserInput() {
  const userText = inputField.value.trim();
  if (!userText) return;
  inputField.value = '';
  addMessage('user', userText);

  // Intercept with logic
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