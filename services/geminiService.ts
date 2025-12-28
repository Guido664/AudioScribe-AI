import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from "./utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeAudio = async (file: File): Promise<string> => {
  try {
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
    throw new Error("Failed to transcribe audio. Please try again.");
  }
};