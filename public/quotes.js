/*
====================================================
 Sokpah AI – Motivation Quotes Engine
 Author: Akin S. Sokpah
 Purpose:
  - Show motivational & noble quotes
  - Auto update every 2 minutes
  - Never repeat quotes in one session
  - Premium smooth UI experience
====================================================
*/

const quotes = [
  "Success in nursing begins with compassion, discipline, and lifelong learning.",
  "You are studying today to save lives tomorrow.",
  "Every great nurse was once a confused student who refused to give up.",
  "Hard days in training build strong hands in practice.",
  "Your certificate will open doors, but your character will keep them open.",
  "Healthcare is not a job — it is a calling.",
  "The pain of studying is temporary, the pride of saving lives is forever.",
  "A focused nurse today becomes a leader tomorrow.",
  "Your mind is your strongest medical tool — train it well.",
  "Do not rush growth. Even injections take time to work.",
  "Great nurses are built in silence, pressure, and patience.",
  "Knowledge is the medicine you give yourself first.",
  "Your future patients are counting on your discipline today.",
  "Nursing excellence is born from consistency, not luck.",
  "Study like someone’s life depends on it — because one day it will.",
  "You don’t need motivation — you need commitment.",
  "Dreams become careers when discipline replaces excuses.",
  "Smart nurses never stop learning.",
  "You were chosen for this path because you can handle it.",
  "Your education is your freedom.",
  "Every page you read is a step closer to mastery.",
  "The world needs nurses who think, not just follow.",
  "Focus beats talent when talent loses focus.",
  "A tired student today becomes a respected professional tomorrow.",
  "Do it scared. Do it tired. Do it anyway.",
  "You are becoming someone your younger self needed.",
  "Nursing is service powered by knowledge.",
  "What you practice daily becomes who you are permanently.",
  "Excellence is a habit, not an event.",
  "The strongest nurses were trained in the hardest seasons."
];

// Copy array to avoid mutation
let remainingQuotes = [...quotes];

const quoteElement = document.getElementById("quote");

// Smooth fade animation
function fadeText(newText) {
  quoteElement.style.opacity = 0;
  setTimeout(() => {
    quoteElement.textContent = newText;
    quoteElement.style.opacity = 1;
  }, 600);
}

// Get random quote without repeat
function getNextQuote() {
  if (remainingQuotes.length === 0) {
    remainingQuotes = [...quotes]; // reset when exhausted
  }

  const index = Math.floor(Math.random() * remainingQuotes.length);
  const selected = remainingQuotes[index];

  remainingQuotes.splice(index, 1);
  return selected;
}

// Initial quote
fadeText(getNextQuote());

// Update every 2 minutes (120,000 ms)
setInterval(() => {
  fadeText(getNextQuote());
}, 120000);

// Console branding
console.log(
  "%cSokpah AI Quotes Engine Active",
  "color: green; font-size: 14px; font-weight: bold;"
);
