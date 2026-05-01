import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'PASTE_YOUR_GEMINI_KEY_HERE') {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your frontend/.env file and restart the dev server.");
  }

  if (!genAI) {
    try {
      const cleanKey = String(apiKey).trim().replace(/^["']|["']$/g, '');
      console.log("🔑 [Gemini] Initializing with @google/generative-ai");
      genAI = new GoogleGenerativeAI(cleanKey);
    } catch (e: any) {
      console.error("❌ [Gemini] Initialization failed:", e.message);
      throw new Error("Failed to initialize Google AI SDK.");
    }
  }
  return genAI;
};

export const generateHealthAdvice = async (prompt: string) => {
  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are a professional and empathetic AI Health Assistant named BioVita AI. ALWAYS include a medical disclaimer."
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error generating health advice:", error);
    throw new Error(error.message || "Failed to get a response from the AI.");
  }
};

export const startHealthChat = (history: any[] = []) => {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: "You are BioVita AI, a smart health assistant. Provide empathetic guidance. ALWAYS include a medical disclaimer."
  });

  return model.startChat({
    history: history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content || h.text || h.parts?.[0]?.text || "" }]
    })),
  });
};
