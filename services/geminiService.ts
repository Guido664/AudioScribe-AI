import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from "./utils";

export const transcribeAudio = async (file: File): Promise<string> => {
  // Vite replaces process.env.API_KEY with the actual string during build.
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "") {
    throw new Error("API Key is missing. If you just added it to Vercel, please go to Deployments -> Redeploy to apply the changes.");
  }

  try {
    // Initialize the client only when needed
    const ai = new GoogleGenAI({ apiKey });
    
    const base64Data = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type || 'audio/mp3',
              data: base64Data
            }
          },
          {
            text: "Please transcribe the following audio file verbatim. Identify different speakers if possible (e.g., Speaker 1, Speaker 2). Format the output cleanly with paragraph breaks."
          }
        ]
      },
    });

    return response.text || "No transcription generated.";
  } catch (error) {
    console.error("Transcription error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
        if (error.message.includes("API key") || error.message.includes("403")) {
            throw new Error("Invalid API Key or Permissions. Check Vercel settings and ensure the key is valid.");
        }
        return `Error: ${error.message}`;
    }
    
    throw new Error("Failed to transcribe audio. Please try again.");
  }
};