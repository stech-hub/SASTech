/* =========================================================
   BioNurse Pro – Website AI Consultant (Enterprise)
   Serverless API for Vercel
   Author: Akin S. Sokpah (Liberia)
========================================================= */

import OpenAI from "openai";

/* ================= OPENAI CLIENT ================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================= SERVICE CATALOG ================= */
const SERVICES = {
  business: {
    name: "Business Website",
    price: "$120 – $250",
    delivery: "5–10 days"
  },
  ecommerce: {
    name: "Product / Store Website",
    price: "$200 – $450",
    delivery: "7–14 days"
  },
  app: {
    name: "App / Platform Website",
    price: "$180 – $350",
    delivery: "6–12 days"
  },
  landing: {
    name: "Landing Page",
    price: "$80 – $150",
    delivery: "2–4 days"
  },
  custom: {
    name: "Custom Advanced Platform",
    price: "Discussed after requirements",
    delivery: "Depends on scope"
  }
};

/* ================= SYSTEM PROMPT ================= */
const SYSTEM_PROMPT = `
You are the official BioNurse Pro Website AI Consultant.

Your personality:
- Professional
- Friendly
- Clear
- Trustworthy
- Not aggressive

Your goals:
1. Understand what website or platform the user wants
2. Explain features in simple English
3. Show transparent recommended price ranges
4. Explain timelines
5. Encourage WhatsApp contact for secure next steps

STRICT RULES:
- NEVER request payment directly
- NEVER provide bank or MoMo numbers
- NEVER pressure or persuade
- ALWAYS say final payment details are shared privately on WhatsApp
- DO NOT claim to finalize projects

WhatsApp:
https://wa.me/231777789356
`;

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    /* ================= ENRICH CONTEXT ================= */
    const serviceContext = `
Available services and pricing:

${Object.values(SERVICES)
  .map(
    s =>
      `• ${s.name}\n  Price: ${s.price}\n  Delivery: ${s.delivery}`
  )
  .join("\n\n")}

Always explain that prices depend on features.
`;

    /* ================= OPENAI REQUEST ================= */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.55,
      max_tokens: 700,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: serviceContext },
        ...messages
      ]
    });

    const reply = completion.choices[0].message.content;

    /* ================= RESPONSE ================= */
    res.status(200).json({
      reply,
      next_step:
        "To continue securely, please contact Akin directly on WhatsApp.",
      whatsapp:
        "https://wa.me/231777789356?text=Hello%20Akin%2C%20I%20need%20a%20website."
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI temporarily unavailable" });
  }
}
