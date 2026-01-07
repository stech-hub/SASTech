// Reveal animations
const elements = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

elements.forEach(el => observer.observe(el));

// AI Chat
async function sendAI() {
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");

  if (!input.value) return;

  const userMsg = document.createElement("div");
  userMsg.className = "ai-msg user";
  userMsg.textContent = input.value;
  messages.appendChild(userMsg);

  const text = input.value;
  input.value = "";
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    const botMsg = document.createElement("div");
    botMsg.className = "ai-msg bot";
    botMsg.textContent = data.reply;
    messages.appendChild(botMsg);
  } catch {
    const err = document.createElement("div");
    err.className = "ai-msg bot";
    err.textContent =
      "Please message Akin on WhatsApp: wa.me/231777789356";
    messages.appendChild(err);
  }

  messages.scrollTop = messages.scrollHeight;
}
