import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from "./utils";

export const transcribeAudio = async (file: File): Promise<string> => {
  // In Vite, environment variables exposed to the client must start with VITE_
  // and are accessed via import.meta.env
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey || apiKey === "") {
    throw new Error("API Key is missing. Please check your Vercel settings.\n1. Go to Settings -> Environment Variables\n2. Add a variable named 'VITE_API_KEY' with your Google AI Key.\n3. Redeploy the app.");
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
            throw new Error("Invalid API Key or Permissions. Check Vercel settings and ensure VITE_API_KEY is valid.");
        }
        return `Error: ${error.message}`;
    }
    
    throw new Error("Failed to transcribe audio. Please try again.");
  }
};