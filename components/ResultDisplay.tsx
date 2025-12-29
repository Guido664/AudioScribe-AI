import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, RefreshIcon, DownloadIcon, LanguageIcon } from './Icons';
import { translateText } from '../services/geminiService';

interface ResultDisplayProps {
  text: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState(text);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isShowingTranslation, setIsShowingTranslation] = useState(false);

  // Sync displayed text if the prop changes (e.g. new upload)
  useEffect(() => {
    setDisplayedText(text);
    setTranslatedText(null);
    setIsShowingTranslation(false);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([displayedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = isShowingTranslation ? "trascrizione_it.txt" : "trascrizione.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleToggleTranslation = async () => {
    if (isShowingTranslation) {
      // Revert to original
      setDisplayedText(text);
      setIsShowingTranslation(false);
    } else {
      // Switch to translation
      if (translatedText) {
        // Use cached translation
        setDisplayedText(translatedText);
        setIsShowingTranslation(true);
      } else {
        // Fetch translation
        setIsTranslating(true);
        try {
          const result = await translateText(text);
          setTranslatedText(result);
          setDisplayedText(result);
          setIsShowingTranslation(true);
        } catch (error) {
          alert("Impossibile completare la traduzione.");
        } finally {
          setIsTranslating(false);
        }
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">
            {isShowingTranslation ? 'Risultato (Italiano)' : 'Risultato Trascrizione'}
        </h2>
        <div className="flex flex-wrap gap-2">
           <button
            onClick={handleToggleTranslation}
            disabled={isTranslating}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${
                isShowingTranslation 
                ? 'bg-brand-900/50 border-brand-500 text-brand-200 hover:bg-brand-900' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
            } disabled:opacity-50 disabled:cursor-wait`}
          >
            {isTranslating ? (
                 <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <LanguageIcon className="w-4 h-4" />
            )}
            <span>{isShowingTranslation ? 'Mostra Originale' : 'Traduci in Italiano'}</span>
          </button>

           <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm font-medium border border-gray-700"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
            <span>{copied ? 'Copiato' : 'Copia'}</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm font-medium border border-gray-700"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Scarica .txt</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors text-sm font-medium"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>Nuovo</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl relative min-h-[200px]">
        {isTranslating && (
             <div className="absolute inset-0 z-10 bg-gray-900/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                 <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-brand-200 font-medium">Traduzione in corso...</span>
                 </div>
             </div>
        )}
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-200">
            {displayedText}
          </p>
        </div>
      </div>
    </div>
  );
};