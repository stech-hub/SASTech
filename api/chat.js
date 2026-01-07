import OpenAI from "openai";

/*
====================================================
 BioNurse Pro / Sokpah AI – Server API
 Author: Akin S. Sokpah
 Purpose:
  - Smart AI assistant
  - Persuade clients professionally
  - Explain pricing clearly
  - Guide payment steps
  - Redirect to WhatsApp smoothly
  - Stable Vercel deployment
====================================================
*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Website pricing data (editable)
const PRICING = {
  landing: {
    name: "Landing Website",
    price: "$80 – $150",
    includes: "1–3 pages, mobile responsive, SEO, WhatsApp integration"
  },
  business: {
    name: "Business Website",
    price: "$200 – $400",
    includes: "5–10 pages, admin panel, SEO, contact forms"
  },
  ecommerce: {
    name: "Online Store",
    price: "$350 – $700",
    includes: "Product system, cart, payment setup, admin dashboard"
  },
  platform: {
    name: "Custom Platform",
    price: "$600 – $1500+",
    includes: "User accounts, dashboards, APIs, AI integration"
  }
};

// Payment instructions
const PAYMENT_INFO = `
💳 PAYMENT METHODS

🏦 Bank Transfer:
• Bank: United Bank Of Africa (UBA)
• Country: Liberia
• Account Number: 53020710015394
• Account Name: Akin S. Sokpah

📱 Mobile Money (MoMo):
• Number: 0889183557
• Name: Akin S. Sokpah

📸 AFTER PAYMENT:
Please send your payment screenshot to WhatsApp:
👉 https://wa.me/231777789356

Once confirmed, your project starts immediately.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const systemPrompt = `
You are Sokpah AI, a professional AI assistant for BioNurse Pro.

Your goals:
- Help users understand BioNurse Pro
- Convince serious clients to build websites/platforms
- Explain services clearly
- Recommend suitable pricing
- Guide payment process politely
- Invite users to WhatsApp when ready
- Sound confident, friendly, African professional tone
- NEVER mention OpenAI or API errors

SERVICES & PRICES:
${Object.values(PRICING).map(p =>
`${p.name}: ${p.price} (${p.includes})`
).join("\n")}

PAYMENT INFO:
${PAYMENT_INFO}

RULES:
- Be persuasive but respectful
- If user wants website → explain options → suggest best fit
- If user asks price → show ranges, not exact unless asked
- If user agrees → give payment instructions + WhatsApp link
- If user is confused → educate calmly
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.6,
      max_tokens: 400
    });

    let reply = completion.choices[0].message.content;

    // Auto WhatsApp invite if intent detected
    if (
      message.toLowerCase().includes("price") ||
      message.toLowerCase().includes("website") ||
      message.toLowerCase().includes("platform") ||
      message.toLowerCase().includes("pay")
    ) {
      reply += `

📲 Ready to move forward?
Message Akin directly on WhatsApp:
👉 https://wa.me/231777789356
`;
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(200).json({
      reply: "⚠️ I'm temporarily busy. Please contact Akin on WhatsApp 👉 https://wa.me/231777789356"
    });
  }
}
