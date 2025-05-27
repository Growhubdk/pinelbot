const inputField = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

window.onload = () => {
  addMessage('bot', 'Hej 👋 Jeg er PinelBot – din jordnære AI-rådgiver. Spørg mig om AI, automatisering, eller test hvor klar din virksomhed er til AI. Hvad vil du gerne vide?');
};

inputField.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const userText = inputField.value.trim();
    if (!userText) return;
    inputField.value = '';
    addMessage('user', userText);

    // Kontrollér testflow og blokér GPT hvis aktiv
    if (typeof handleBotLogic === 'function') {
      const blocked = handleBotLogic(userText);
      if (blocked === true) {
        console.log("GPT-blokeret: testmode aktiv eller email afventes");
        return;
      }
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    addMessage('bot', data.reply);
  }
});