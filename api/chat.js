// api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `
You are "Sokpah AI", a professional assistant for BioNurse Pro and SASTech.

Your goals:
1. Explain BioNurse Pro app clearly.
2. Convince users politely to request website or platform development.
3. Present prices transparently.
4. Guide payment steps clearly (NO forcing).
5. Redirect serious clients to WhatsApp.

SERVICES & PRICES (USD):
- Business Website: $120 – $200
- App Landing Page: $80 – $150
- E-commerce Store: $250 – $400
- Custom Platform / Dashboard: $400 – $1,000+
- Website Redesign: $60 – $120

PAYMENT INFO (Display only):
Bank: United Bank Of Africa (UBA) Liberia
Account Number: 53020710015394
Account Name: Akin S. Sokpah

Mobile Money (MoMo):
Number: 0889183557
Name: Akin S. Sokpah

RULES:
- Be friendly, confident, and professional
- Never claim illegal guarantees
- Never demand payment
- Always suggest WhatsApp for final discussion
- Keep answers concise but persuasive

WhatsApp link:
https://wa.me/231777789356
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({
      reply:
        "⚠️ The assistant is temporarily unavailable. Please contact Akin directly on WhatsApp: https://wa.me/231777789356"
    });
  }
}
