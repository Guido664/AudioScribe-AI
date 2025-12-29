import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from "./utils";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Chiave API non trovata. Assicurati di aver impostato la variabile d'ambiente API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const transcribeAudio = async (file: File): Promise<string> => {
  try {
    const ai = getClient();
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
    
    let errorMessage = "Impossibile trascrivere l'audio. Per favore riprova.";
    
    if (error instanceof Error) {
        // Case insensitive check for "api key" to catch SDK errors
        if (/api key/i.test(error.message) || error.message.includes("403")) {
            errorMessage = "Chiave API non valida o permessi mancanti. Controlla la configurazione.";
        } else if (error.message.includes("Chiave API non trovata")) {
            errorMessage = error.message;
        } else {
             errorMessage = `Errore: ${error.message}`;
        }
    }
    
    throw new Error(errorMessage);
  }
};

export const translateText = async (text: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate the following text into accurate and natural sounding Italian. Keep the formatting (paragraphs, speaker labels) intact. \n\n${text}`,
    });

    return response.text || "Traduzione fallita.";
  } catch (error) {
    console.error("Translation error:", error);
    if (error instanceof Error) {
        if (/api key/i.test(error.message) || error.message.includes("Chiave API")) {
            throw new Error("Chiave API mancante o non valida.");
        }
    }
    throw new Error("Impossibile tradurre il testo.");
  }
};