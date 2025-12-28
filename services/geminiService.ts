import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from "./utils";

// We remove the top-level initialization to prevent the app from crashing on load (Black Screen)
// if the API key is missing or env vars are not loaded yet.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeAudio = async (file: File): Promise<string> => {
  // Vite replaces process.env.API_KEY with the actual string during build.
  // If it's missing on Vercel, this check prevents a crash and gives a helpful error.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please add API_KEY to your Vercel Environment Variables.");
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
        if (error.message.includes("API key")) {
            throw new Error("Invalid API Key. Please check your Vercel settings.");
        }
        return `Error: ${error.message}`;
    }
    
    throw new Error("Failed to transcribe audio. Please try again.");
  }
};