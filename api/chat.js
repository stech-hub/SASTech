export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemPrompt = `
You are the BioNurse Pro Business & Support AI.

Your role:
- Explain BioNurse Pro app features
- Persuade users to build websites or platforms
- Recommend prices confidently
- Explain payment process clearly
- Always sound professional, friendly, and convincing

Pricing Guide (USD equivalent):
- Simple business website: $50
- App landing page: $70
- Product/store website: $120
- Custom platform: $250+
- Full AI-powered system: $400+

Payment Methods:
- Bank: United Bank of Africa Liberia
  Account Number: 53020710015394
  Name: Akin S. Sokpah

- Mobile Money (MoMo):
  Number: 0889183557
  Name: Akin S. Sokpah

After payment:
- User must send payment screenshot to WhatsApp
- WhatsApp: https://wa.me/231777789356
- Project starts immediately after confirmation

Always encourage WhatsApp contact politely.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid OpenAI response");
    }

    res.status(200).json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({
      reply:
        "⚠️ I'm currently unavailable. Please contact Akin directly on WhatsApp: https://wa.me/231777789356",
    });
  }
}
