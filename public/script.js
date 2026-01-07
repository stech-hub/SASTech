/* =========================================================
   BioNurse Pro – Website AI Assistant Frontend
   Author: Akin S. Sokpah
   Purpose:
   - Floating AI Assistant
   - Chat UI
   - Image upload (snaps of designs)
   - Smart responses
   - WhatsApp handoff
========================================================= */

/* ================= GLOBAL STATE ================= */

const aiState = {
  isOpen: false,
  isTyping: false,
  messages: [
    {
      role: "assistant",
      content:
        "Hello 👋 I'm the BioNurse Pro assistant. I can help you understand the app or guide you if you want a website or platform built."
    }
  ],
  uploadedImages: []
};

/* ================= ELEMENT REFERENCES ================= */

const aiIcon = document.createElement("div");
const aiContainer = document.createElement("div");
const aiHeader = document.createElement("div");
const aiBody = document.createElement("div");
const aiFooter = document.createElement("div");
const aiInput = document.createElement("input");
const aiSendBtn = document.createElement("button");
const aiUploadBtn = document.createElement("input");

/* ================= FLOATING ICON ================= */

aiIcon.id = "ai-floating-icon";
aiIcon.innerHTML = "🤖";
document.body.appendChild(aiIcon);

/* ================= AI CONTAINER ================= */

aiContainer.id = "ai-container";
aiContainer.classList.add("hidden");

aiHeader.id = "ai-header";
aiHeader.innerHTML = `
  <span>🤖 BioNurse Assistant</span>
  <button id="ai-close">✖</button>
`;

aiBody.id = "ai-body";

aiFooter.id = "ai-footer";
aiInput.type = "text";
aiInput.placeholder = "Type your message...";
aiSendBtn.textContent = "Send";

aiUploadBtn.type = "file";
aiUploadBtn.accept = "image/*";
aiUploadBtn.id = "ai-upload";

aiFooter.appendChild(aiUploadBtn);
aiFooter.appendChild(aiInput);
aiFooter.appendChild(aiSendBtn);

aiContainer.appendChild(aiHeader);
aiContainer.appendChild(aiBody);
aiContainer.appendChild(aiFooter);
document.body.appendChild(aiContainer);

/* ================= UI STYLES (JS-INJECTED) ================= */

const style = document.createElement("style");
style.innerHTML = `
#ai-floating-icon {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: #1e90ff;
  color: white;
  font-size: 26px;
  padding: 14px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 15px 30px rgba(0,0,0,.3);
  z-index: 9999;
}

#ai-container {
  position: fixed;
  bottom: 90px;
  right: 25px;
  width: 360px;
  max-height: 520px;
  background: #0f172a;
  color: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}

#ai-container.hidden {
  display: none;
}

#ai-header {
  padding: 14px;
  background: #020617;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#ai-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.ai-msg {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  max-width: 85%;
}

.ai-user {
  background: #1e293b;
  align-self: flex-end;
}

.ai-bot {
  background: #1e40af;
  align-self: flex-start;
}

#ai-footer {
  padding: 10px;
  display: flex;
  gap: 6px;
  background: #020617;
}

#ai-footer input[type="text"] {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: none;
}

#ai-footer button {
  padding: 8px 12px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}
`;
document.head.appendChild(style);

/* ================= RENDER MESSAGES ================= */

function renderMessages() {
  aiBody.innerHTML = "";
  aiState.messages.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("ai-msg");
    div.classList.add(msg.role === "user" ? "ai-user" : "ai-bot");
    div.textContent = msg.content;
    aiBody.appendChild(div);
  });
  aiBody.scrollTop = aiBody.scrollHeight;
}

/* ================= TOGGLE AI ================= */

aiIcon.onclick = () => {
  aiState.isOpen = !aiState.isOpen;
  aiContainer.classList.toggle("hidden");
  renderMessages();
};

document.getElementById("ai-close").onclick = () => {
  aiState.isOpen = false;
  aiContainer.classList.add("hidden");
};

/* ================= SEND MESSAGE ================= */

async function sendMessage() {
  const text = aiInput.value.trim();
  if (!text) return;

  aiState.messages.push({ role: "user", content: text });
  aiInput.value = "";
  renderMessages();

  showTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: aiState.messages
      })
    });

    const data = await res.json();

    aiState.messages.push({
      role: "assistant",
      content: data.reply
    });

    if (data.whatsapp) {
      aiState.messages.push({
        role: "assistant",
        content:
          "👉 Continue on WhatsApp: " + data.whatsapp
      });
    }

  } catch (err) {
    aiState.messages.push({
      role: "assistant",
      content:
        "⚠️ Sorry, I'm having trouble right now. Please contact Akin on WhatsApp."
    });
  }

  hideTyping();
  renderMessages();
}

/* ================= TYPING INDICATOR ================= */

function showTyping() {
  aiState.isTyping = true;
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "ai-msg ai-bot";
  typing.textContent = "Typing...";
  aiBody.appendChild(typing);
}

function hideTyping() {
  aiState.isTyping = false;
  const t = document.getElementById("typing");
  if (t) t.remove();
}

/* ================= IMAGE UPLOAD ================= */

aiUploadBtn.onchange = () => {
  const file = aiUploadBtn.files[0];
  if (!file) return;

  aiState.uploadedImages.push(file);

  aiState.messages.push({
    role: "user",
    content:
      "📸 I uploaded a design reference image for my website."
  });

  renderMessages();
};

/* ================= EVENTS ================= */

aiSendBtn.onclick = sendMessage;
aiInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

/* ================= AUTO MESSAGE ================= */

setTimeout(() => {
  if (!aiState.isOpen) {
    aiState.messages.push({
      role: "assistant",
      content:
        "💡 Tip: Click the 🤖 icon if you need help or want a website built."
    });
  }
}, 6000);
