import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from "./utils";

export const transcribeAudio = async (file: File): Promise<string> => {
  // Fixed: Use process.env.API_KEY as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    return response.text || "Nessuna trascrizione generata.";
  } catch (error) {
    console.error("Transcription error:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
        if (error.message.includes("API key") || error.message.includes("403")) {
            throw new Error("Chiave API non valida o permessi mancanti. Controlla la configurazione.");
        }
        return `Errore: ${error.message}`;
    }
    
    throw new Error("Impossibile trascrivere l'audio. Per favore riprova.");
  }
};

export const translateText = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following text into accurate and natural sounding Italian. Keep the formatting (paragraphs, speaker labels) intact. \n\n${text}`,
    });

    return response.text || "Traduzione fallita.";
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Impossibile tradurre il testo.");
  }
};