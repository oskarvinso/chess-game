
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiMove = async (fen: string, history: string[]): Promise<string> => {
  try {
    const prompt = `You are a high-level Chess Grandmaster. 
Current board position (FEN): ${fen}
Game history: ${history.join(', ')}

Please analyze the position and provide the absolute best move for the current player. 
Return only the move in Standard Algebraic Notation (SAN), like "e4", "Nf3", "O-O", "Bxe5".
Do not include any explanation or other text.`;

    // Fix: Use 'gemini-3-pro-preview' for complex reasoning tasks like chess
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.1, // Lower temperature for more deterministic/logical chess moves
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    // Fix: Ensure .text property is used correctly (not a method)
    const move = response.text?.trim() || '';
    // Basic sanitization
    return move.replace(/[^a-zA-Z0-9#+=x-]/g, '');
  } catch (error) {
    console.error("Gemini Move Error:", error);
    return "";
  }
};
