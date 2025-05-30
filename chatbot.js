const inputField = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.getElementById('messages');

// Tilføj bruger- eller bot-besked
function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'bubble user-bubble' : 'bubble bot-bubble';
  msg.innerHTML = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Initial bot-besked
window.onload = () => {
  addMessage('bot', 'Hej 👋 Jeg er PinelBot – din jordnære AI-rådgiver. Spørg mig om AI, automatisering, eller test hvor klar din virksomhed er til AI. Hvad vil du gerne vide?');
};

// Send besked-funktion
async function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;
  inputField.value = '';
  addMessage('user', userText);

  if (typeof handleBotLogic === 'function') {
    const blocked = handleBotLogic(userText);
    if (blocked === true) {
      console.log("GPT-blokeret: testmode aktiv eller email afventes");
      return;
    }
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    addMessage('bot', data.reply);
  } catch (error) {
    console.error('Fejl ved hentning af svar:', error);
    addMessage('bot', 'Beklager, der opstod en fejl. Prøv igen senere.');
  }
}

// Trigger send med Enter
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Trigger send med klik
sendButton.addEventListener('click', sendMessage);
