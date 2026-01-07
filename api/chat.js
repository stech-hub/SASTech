/* =========================================================
   BioNurse Pro – AI Assistant API
   Serverless Function (Vercel)
   Author: Akin S. Sokpah
========================================================= */

import OpenAI from "openai";

/* ================= OPENAI CLIENT ================= */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ================= MAIN HANDLER ================= */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages format"
      });
    }

    /* ================= SYSTEM PROMPT ================= */
    const systemPrompt = {
      role: "system",
      content: `
You are the BioNurse Pro Website AI Consultant.

Your role:
- Understand what type of website or platform the user wants
- Explain things clearly in simple English
- Encourage users to contact Akin S. Sokpah on WhatsApp
- NEVER give prices
- NEVER pretend to finalize deals
- Always guide to WhatsApp for next step

WhatsApp Contact:
https://wa.me/231777789356
`
    };

    /* ================= OPENAI CALL ================= */
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemPrompt, ...messages],
      temperature: 0.6,
      max_tokens: 400
    });

    const reply = completion.choices[0].message.content;

    /* ================= RESPONSE ================= */
    res.status(200).json({
      reply,
      whatsapp:
        "https://wa.me/231777789356?text=Hello%20Akin%2C%20I%20came%20from%20BioNurse%20website."
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      error: "AI service unavailable"
    });
  }
}
