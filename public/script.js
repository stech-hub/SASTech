/* =====================================================
   BioNurse Pro – Frontend AI Controller
   Author: Akin S. Sokpah
   Handles:
   - AI chat
   - UI behavior
   - Error recovery
   - WhatsApp fallback
===================================================== */

const aiBox = document.querySelector(".ai-box");
const aiMessages = document.getElementById("aiMessages");
const aiInput = document.getElementById("aiInput");

let isThinking = false;

// Toggle assistant (if icon exists)
function toggleAI() {
  aiBox.classList.toggle("open");
}

// Send message to AI
async function sendAI() {
  const text = aiInput.value.trim();
  if (!text || isThinking) return;

  addMessage(text, "user");
  aiInput.value = "";
  isThinking = true;

  const typingId = addTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    removeTyping(typingId);

    if (!data.reply) {
      throw new Error("No reply from AI");
    }

    addMessage(data.reply, "bot");

  } catch (err) {
    removeTyping(typingId);
    addMessage(
      "⚠️ I'm having trouble right now. Please contact Akin on WhatsApp 👉 https://wa.me/231777789356",
      "bot error"
    );
  } finally {
    isThinking = false;
  }
}

// Add message bubble
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `ai-msg ${type}`;
  msg.innerText = text;
  aiMessages.appendChild(msg);
  scrollDown();
}

// Typing indicator
function addTyping() {
  const typing = document.createElement("div");
  typing.className = "ai-msg bot typing";
  typing.innerHTML = "Sokpah AI is thinking<span>.</span><span>.</span><span>.</span>";
  aiMessages.appendChild(typing);
  scrollDown();
  return typing;
}

function removeTyping(el) {
  if (el) el.remove();
}

// Scroll chat down
function scrollDown() {
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

// Enter key support
aiInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendAI();
  }
});

/* ==========================
   Auto Greeting (once)
========================== */
window.addEventListener("load", () => {
  setTimeout(() => {
    addMessage(
      "Hello 👋 I'm the BioNurse Pro assistant.\n\nI can help you understand the app or guide you if you want a website, store, or platform built.\n\n💡 Tip: You can tell me what you want and I’ll guide you professionally.",
      "bot"
    );
  }, 800);
});

/* ==========================
   Image Upload (UI-ready)
   (Backend can be added later)
========================== */
function uploadImage(file) {
  if (!file) return;
  addMessage("📸 Image uploaded. Sokpah AI will review your design idea.", "user");
  addMessage(
    "Great! I see your design idea. I’ll analyze it and recommend the best structure, features, and pricing for your project.",
    "bot"
  );
}

/* ==========================
   Safety fallback
========================== */
window.onerror = function () {
  addMessage(
    "⚠️ Something went wrong. Please message Akin on WhatsApp 👉 https://wa.me/231777789356",
    "bot error"
  );
};
