/* =========================================================
   BIO NURSE PRO – MAIN CLIENT SCRIPT
   Author: Akin S. Sokpah
   Purpose: UX, AI Assistant, WhatsApp Integration
========================================================= */

/* ================= GLOBAL STATE ================= */
const AppState = {
  assistantOpen: false,
  messages: [],
  userIntent: null
};

/* ================= DOM ELEMENTS ================= */
document.addEventListener("DOMContentLoaded", () => {
  initAssistantIcon();
});

/* ================= AI ASSISTANT ICON ================= */
function initAssistantIcon() {
  const icon = document.getElementById("assistantIcon");

  if (!icon) return;

  icon.addEventListener("click", () => {
    toggleAssistant();
  });
}

/* ================= TOGGLE ASSISTANT ================= */
function toggleAssistant() {
  let modal = document.getElementById("assistantModal");

  if (!modal) {
    modal = createAssistantModal();
    document.body.appendChild(modal);
  }

  AppState.assistantOpen = !AppState.assistantOpen;
  modal.style.display = AppState.assistantOpen ? "flex" : "none";
}

/* ================= CREATE ASSISTANT MODAL ================= */
function createAssistantModal() {
  const modal = document.createElement("div");
  modal.id = "assistantModal";
  modal.style.position = "fixed";
  modal.style.inset = "0";
  modal.style.background = "rgba(0,0,0,0.65)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "10000";

  modal.innerHTML = `
    <div class="assistant-box">
      <div class="assistant-header">
        <strong>BioNurse AI Consultant</strong>
        <button id="closeAssistant">✕</button>
      </div>

      <div class="assistant-messages" id="assistantMessages">
        <div class="assistant-message ai">
          👋 Hello!  
          Tell me what kind of website or platform you want.  
          You can even upload screenshots.
        </div>
      </div>

      <div class="assistant-input">
        <input type="text" id="assistantInput" placeholder="Describe your project..." />
        <button id="assistantSend">Send</button>
      </div>

      <div class="assistant-footer">
        <small>Powered by BioNurse Pro</small>
      </div>
    </div>
  `;

  modal.querySelector("#closeAssistant").onclick = toggleAssistant;
  modal.querySelector("#assistantSend").onclick = handleUserMessage;
  modal.querySelector("#assistantInput").addEventListener("keydown", e => {
    if (e.key === "Enter") handleUserMessage();
  });

  return modal;
}

/* ================= HANDLE MESSAGE ================= */
function handleUserMessage() {
  const input = document.getElementById("assistantInput");
  const message = input.value.trim();

  if (!message) return;

  appendMessage(message, "user");
  input.value = "";

  AppState.messages.push({ role: "user", content: message });

  simulateAIResponse(message);
}

/* ================= APPEND MESSAGE ================= */
function appendMessage(text, role) {
  const box = document.getElementById("assistantMessages");
  const msg = document.createElement("div");

  msg.className = `assistant-message ${role}`;
  msg.textContent = text;

  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

/* ================= AI LOGIC (FRONTEND SIMULATION) ================= */
function simulateAIResponse(userText) {
  setTimeout(() => {
    let response = analyzeIntent(userText);
    appendMessage(response, "ai");
  }, 800);
}

/* ================= INTENT ANALYSIS ================= */
function analyzeIntent(text) {
  const lower = text.toLowerCase();

  if (lower.includes("website") || lower.includes("business")) {
    AppState.userIntent = "website";
    return (
      "Great 👍 I can help you plan a professional website.\n\n" +
      "I will now connect you directly to Akin on WhatsApp for full discussion."
    );
  }

  if (lower.includes("app")) {
    AppState.userIntent = "app";
    return (
      "Nice idea 🚀 An app project needs proper planning.\n\n" +
      "Let me connect you with Akin on WhatsApp now."
    );
  }

  return (
    "Thank you for your message 😊\n\n" +
    "I understand your needs. I will connect you with Akin for detailed support."
  );
}

/* ================= AUTO WHATSAPP REDIRECT ================= */
function redirectToWhatsApp() {
  const base = "https://wa.me/231777789356";
  const text = encodeURIComponent(
    "Hello Akin, I contacted you via the BioNurse website. I want help with a project."
  );

  window.open(`${base}?text=${text}`, "_blank");
}

/* ================= AUTO INVITE AFTER AI ================= */
setInterval(() => {
  if (AppState.userIntent && AppState.messages.length >= 2) {
    redirectToWhatsApp();
    AppState.userIntent = null;
  }
}, 4000);

/* ================= FUTURE EXTENSIONS ================= */
/*
- OpenAI API call via /api/chat.js
- Image upload
- Conversation memory
- Admin dashboard
- Analytics hooks
- Lead storage
*/
