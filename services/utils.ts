/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the Data-URI prefix (e.g. "data:audio/mp3;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validates audio file size and type.
 * Limit: 20MB to avoid browser crashes with large base64 strings.
 */
export const validateAudioFile = (file: File): { valid: boolean; message?: string } => {
  const MAX_SIZE_MB = 20;
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-m4a', 'audio/webm', 'audio/ogg', 'audio/aac'];

  if (!file.type.startsWith('audio/') && !validTypes.includes(file.type)) {
    return { valid: false, message: 'Carica un file audio valido (MP3, WAV, M4A, ecc.).' };
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, message: `Il file è troppo grande. La dimensione massima è ${MAX_SIZE_MB}MB.` };
  }

  return { valid: true };
};