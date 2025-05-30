let conversationState = "idle";
let testProgress = 0;

function handleBotLogic(userInput) {
  const input = userInput.toLowerCase();

  // Triggere for usikkerhed eller tvivl → Start test
  const triggerTest = ["ved ikke", "tvivl", "usikker", "hvordan kommer", "hvordan starter", "er vi klar"];
  const wantsTest = triggerTest.some(trigger => input.includes(trigger));

  if (conversationState === "idle" && wantsTest && testProgress === 0) {
    conversationState = "test_started";
    testProgress = 1;
    addMessage('bot', "Lad os tage AI-paratheds-testen ✅\n👉 Har I allerede brugt AI i jeres virksomhed – bare lidt? (Svar 'ja' eller 'nej')");
    return true;
  }

  if (conversationState === "test_started") {
    if (testProgress === 1) {
      if (input === "ja" || input === "nej") {
        testProgress = 2;
        addMessage('bot', "👉 Har I nogle arbejdsgange, der gentager sig og kunne være automatiseret? (Svar 'ja' eller 'nej')");
        return true;
      } else {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
    }

    if (testProgress === 2) {
      if (input === "ja" || input === "nej") {
        testProgress = 3;
        addMessage('bot', "👉 Er I åbne for at afprøve nye digitale værktøjer? (Svar 'ja' eller 'nej')");
        return true;
      } else {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
    }

    if (testProgress === 3) {
      if (input === "ja" || input === "nej") {
        conversationState = "idle";
        testProgress = 0;
        addMessage('bot', "Tak for dine svar 🙌 Det giver et rigtig godt billede af, hvor I står. Vil du have et konkret forslag baseret på dine svar?");
        return true;
      } else {
        addMessage('bot', "Skriv venligst 'ja' eller 'nej' 🙂");
        return true;
      }
    }
  }

  return false; // falder tilbage til GPT hvis ikke fanget
}
