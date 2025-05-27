const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

inputField.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const userText = inputField.value.trim();
    if (!userText) return;
    inputField.value = '';
    addMessage('user', userText);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    addMessage('bot', data.reply);
    handleBotLogic(userText);
  }
});

function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'bubble user-bubble' : 'bubble bot-bubble';
  msg.innerHTML = text;
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}