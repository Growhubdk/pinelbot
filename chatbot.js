document.getElementById('user-input').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const inputField = e.target;
    const userText = inputField.value.trim();
    if (!userText) return;
    inputField.value = '';
    addMessage('Du', userText);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    addMessage('PinelBot', data.reply);
    handleBotLogic(userText);
  }
});

function addMessage(sender, text) {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<div><strong>${sender}:</strong> ${text}</div>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}