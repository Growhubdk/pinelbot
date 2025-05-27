document.getElementById('user-input').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const inputField = e.target;
    const userText = inputField.value;
    inputField.value = '';
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div><strong>Du:</strong> ${userText}</div>`;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });
    const data = await response.json();
    messagesDiv.innerHTML += `<div><strong>PinelBot:</strong> ${data.reply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
});