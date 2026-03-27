const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function getAIReply(context: string, userMessage: string, role: string = "AI Assistant"): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn("Gemini API key is not set in environment variables");
    return "I am currently offline as my API key is missing.";
  }

  const systemPrompt = `You are a helpful and articulate AI Assistant in an Indian civic tech app called "Community Connect" (or Space). 
You help facilitate constructive discussions between citizens, city officials, and ministries.
Your tone should be helpful, informative, and neutral. 
Context: ${context}
Role: ${role}

Please respond to the user's message concisely.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\nUser Message: " + userMessage }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
}
