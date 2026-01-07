export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a customer assistant for BioNurse Pro and Akin Sokpah. Be polite and guide users to WhatsApp when needed."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    res.status(200).json({
      reply: data.choices[0].message.content
    });
  } catch {
    res.status(500).json({ error: "AI failed" });
  }
}
