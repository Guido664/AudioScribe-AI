import React from 'react';

export const ProcessingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-fade-in">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-brand-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-brand-300 border-solid rounded-full animate-spin reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-white">Trascrizione in corso</h3>
        <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
          Gemini sta ascoltando il tuo file audio e lo sta convertendo in testo. Potrebbe richiedere un attimo a seconda della lunghezza del file.
        </p>
      </div>
    </div>
  );
};