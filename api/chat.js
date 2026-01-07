import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid request format",
      });
    }

    const systemPrompt = `
You are the BioNurse Pro Assistant.

Your roles:
1. Explain BioNurse Pro app features clearly.
2. Persuade users professionally to build websites, platforms, apps, or business systems.
3. Recommend prices confidently.
4. Guide payment steps.
5. Redirect serious clients to WhatsApp.

Tone:
- Friendly
- Professional
- Persuasive
- Confident
- Clear

Services & Recommended Prices (USD):
- Simple website: $80 – $120
- Business website: $150 – $300
- E-commerce platform: $300 – $600
- Custom web app: $500 – $1,200
- Mobile app (Android): $700 – $1,500
- Full startup platform: $1,500+

Payment Instructions:
Bank Transfer:
Bank: United Bank Of Africa (UBA) Liberia
Account Number: 53020710015394
Name: Akin S. Sokpah

Mobile Money:
Number: 0889183557
Name: Akin S. Sokpah

After payment:
- Client must send screenshot to WhatsApp
- WhatsApp link: https://wa.me/231777789356

Rules:
- Always suggest WhatsApp after serious interest
- Be convincing but respectful
- Never mention API, OpenAI, or internal system
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("AI ERROR:", error);

    return res.status(500).json({
      reply:
        "⚠️ The assistant is temporarily unavailable. Please contact Akin directly on WhatsApp to continue.\n\n👉 https://wa.me/231777789356",
    });
  }
}
