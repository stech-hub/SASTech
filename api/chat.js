/* =========================================================
   BioNurse Pro – AI Consultant API
   File: /api/chat.js
   Platform: Vercel Serverless
   Author: Akin S. Sokpah
   Level: Advanced / Consultant-grade
========================================================= */

import fetch from "node-fetch";

/* -------------------------
   CONFIG
-------------------------- */
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

/* -------------------------
   PRICING LOGIC (USD)
-------------------------- */
const PRICES = {
  business: 150,
  ecommerce: 250,
  appWebsite: 200,
  platform: 400,
  template: 80
};

/* -------------------------
   SYSTEM PROMPT (VERY IMPORTANT)
-------------------------- */
const SYSTEM_PROMPT = `
You are the BioNurse Pro Assistant.
You are a professional AI consultant, not a chatbot toy.

Your goals:
1. Help users understand BioNurse Pro (nursing app).
2. If they want a website or platform:
   - Act like a senior web consultant.
   - Ask smart questions.
   - Recommend the best solution.
   - Clearly explain pricing.
   - Persuade politely and professionally.
3. When user shows interest:
   - Explain payment steps.
   - Ask them to send payment screenshot on WhatsApp.
   - Invite them to WhatsApp to start the project.

Tone:
- Friendly
- Confident
- Professional
- Persuasive but respectful

IMPORTANT RULES:
- Never mention OpenAI.
- Never say you are GPT.
- Never promise impossible things.
- Always guide toward WhatsApp for final agreement.

Payment Info (always correct):
Bank: United Bank Of Africa (UBA) Liberia
Account Number: 53020710015394
Account Name: Akin S. Sokpah

Mobile Money (MoMo):
Number: 0889183557
Name: Akin S. Sokpah
`;

/* -------------------------
   HELPER: Detect Intent
-------------------------- */
function detectIntent(text = "") {
  const t = text.toLowerCase();

  if (t.includes("website") || t.includes("site")) return "website";
  if (t.includes("store") || t.includes("shop")) return "ecommerce";
  if (t.includes("app")) return "app";
  if (t.includes("platform")) return "platform";
  if (t.includes("price") || t.includes("cost")) return "pricing";

  return "general";
}

/* -------------------------
   HELPER: Price Message
-------------------------- */
function pricingMessage() {
  return `
💰 <strong>Recommended Prices</strong>

• Business Website – $${PRICES.business}
• E-commerce / Store – $${PRICES.ecommerce}
• App / Landing Website – $${PRICES.appWebsite}
• Full Platform / System – $${PRICES.platform}
• Template Website – $${PRICES.template}

✅ Includes design, setup, and deployment.
`;
}

/* -------------------------
   HELPER: Payment Message
-------------------------- */
function paymentMessage() {
  return `
🏦 <strong>Payment Methods</strong>

<strong>Bank Transfer</strong>
United Bank Of Africa (UBA) – Liberia  
Account Number: <strong>53020710015394</strong>  
Account Name: <strong>Akin S. Sokpah</strong>

<strong>Mobile Money (MoMo)</strong>  
Number: <strong>0889183557</strong>  
Name: <strong>Akin S. Sokpah</strong>

📸 After payment, please send the screenshot on WhatsApp to start immediately.
`;
}

/* -------------------------
   MAIN HANDLER
-------------------------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed." });
  }

  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({
        reply:
          "⚠️ Assistant is temporarily unavailable. Please contact Akin on WhatsApp."
      });
    }

    const { messages = [] } = req.body;

    const lastUserMessage =
      messages.length > 0 ? messages[messages.length - 1].content : "";

    const intent = detectIntent(lastUserMessage);

    /* -------------------------
       BUILD AI MESSAGES
    -------------------------- */
    const aiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: aiMessages,
        temperature: 0.6
      })
    });

    const data = await response.json();

    let reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't respond properly.";

    /* -------------------------
       ADD BUSINESS LOGIC
    -------------------------- */
    let inviteWhatsapp = false;

    if (intent === "pricing") {
      reply += "\n\n" + pricingMessage();
      inviteWhatsapp = true;
    }

    if (
      intent === "website" ||
      intent === "ecommerce" ||
      intent === "app" ||
      intent === "platform"
    ) {
      reply +=
        "\n\n" +
        pricingMessage() +
        "\n\n" +
        paymentMessage() +
        "\n\n📲 Once payment is made, message Akin on WhatsApp to begin your project.";
      inviteWhatsapp = true;
    }

    /* -------------------------
       FINAL RESPONSE
    -------------------------- */
    return res.status(200).json({
      reply,
      inviteWhatsapp
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      reply:
        "⚠️ Sorry, I'm having trouble right now. Please contact Akin on WhatsApp."
    });
  }
}
