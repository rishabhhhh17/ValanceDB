// utils/groq.js

export const callGroq = async (prompt, systemContext) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key not found in .env (VITE_GROQ_API_KEY)');
  }

  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  const payload = {
    model: "llama-3.1-8b-instant", // Fast and robust model
    messages: [
      { role: "system", content: systemContext },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 800,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API Request Failed");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
};
