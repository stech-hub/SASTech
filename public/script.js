/* =========================================================
   BioNurse Pro – AI Assistant Frontend Logic
   Author: Akin S. Sokpah
   Level: Advanced / Production-ready
========================================================= */

/* -------------------------
   GLOBAL STATE
-------------------------- */
let aiOpen = false;
let conversationHistory = [];

/* -------------------------
   TOGGLE AI BOX
-------------------------- */
function toggleAI() {
  const aiBox = document.getElementById("aiBox");
  aiOpen = !aiOpen;
  aiBox.style.display = aiOpen ? "flex" : "none";
}

/* -------------------------
   DOM HELPERS
-------------------------- */
function addMessage(sender, text) {
  const messages = document.getElementById("aiMessages");

  const msgDiv = document.createElement("div");
  msgDiv.className = `ai-msg ${sender}`;
  msgDiv.innerHTML = text.replace(/\n/g, "<br>");

  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

/* -------------------------
   IMAGE PREVIEW
-------------------------- */
function handleImagePreview(file) {
  const reader = new FileReader();
  reader.onload = () => {
    addMessage(
      "user",
      `<strong>📸 Uploaded Image:</strong><br><img src="${reader.result}" style="max-width:100%;border-radius:10px;margin-top:8px;" />`
    );
  };
  reader.readAsDataURL(file);
}

/* -------------------------
   SEND MESSAGE TO AI
-------------------------- */
async function sendAI() {
  const input = document.getElementById("aiInput");
  const imageInput = document.getElementById("aiImage");

  const userText = input.value.trim();
  const imageFile = imageInput.files[0];

  if (!userText && !imageFile) return;

  // Show user message
  if (userText) {
    addMessage("user", userText);
    conversationHistory.push({ role: "user", content: userText });
  }

  // Handle image
  if (imageFile) {
    handleImagePreview(imageFile);
  }

  // Reset inputs
  input.value = "";
  imageInput.value = "";

  // Typing indicator
  addMessage("bot", "⏳ Thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: conversationHistory,
        hasImage: !!imageFile
      })
    });

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    // Remove "Thinking..."
    document.querySelector(".ai-msg.bot:last-child")?.remove();

    addMessage("bot", data.reply);

    conversationHistory.push({
      role: "assistant",
      content: data.reply
    });

    // Auto WhatsApp Invite (when intent detected)
    if (data.inviteWhatsapp) {
      setTimeout(() => {
        addMessage(
          "bot",
          `📲 <strong>Continue on WhatsApp:</strong><br>
           <a href="https://wa.me/231777789356?text=Hello%20Akin%2C%20I%20want%20a%20website%20or%20platform."
              target="_blank"
              style="color:#1e90ff;font-weight:bold;">
              Message Akin on WhatsApp
           </a>`
        );
      }, 800);
    }

  } catch (error) {
    console.error(error);

    document.querySelector(".ai-msg.bot:last-child")?.remove();

    addMessage(
      "bot",
      "⚠️ Sorry, I'm having trouble right now.<br>Please contact Akin on WhatsApp."
    );
  }
}

/* -------------------------
   ENTER KEY SUPPORT
-------------------------- */
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && aiOpen) {
    sendAI();
  }
});

/* -------------------------
   AUTO GREETING (ON LOAD)
-------------------------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    addMessage(
      "bot",
      "💡 Tip: You can ask about BioNurse Pro or request a website. Upload a screenshot if you have a design idea."
    );
  }, 1200);
});
