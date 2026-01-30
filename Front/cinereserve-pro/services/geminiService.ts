
import { GoogleGenAI } from "@google/genai";

export const getMovieRecommendation = async (userMood: string) => {
  // Use process.env.API_KEY directly as per Google GenAI SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário está se sentindo: ${userMood}. Sugira um gênero de filme e explique por que combina com o humor dele em uma frase curta em português.`,
    });
    
    // Access .text property directly as per guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível carregar a recomendação agora.";
  }
};
