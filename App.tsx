import React, { useState, useRef } from 'react';
import { AppState } from './types';
import { validateAudioFile } from './services/utils';
import { transcribeAudio } from './services/geminiService';
import { ProcessingState } from './components/ProcessingState';
import { ResultDisplay } from './components/ResultDisplay';
import { UploadIcon, AudioFileIcon } from './components/Icons';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [transcription, setTranscription] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await processFile(file);
  };

  const processFile = async (file: File) => {
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.message || 'File non valido');
      return;
    }

    setErrorMsg(null);
    setAppState(AppState.PROCESSING);

    try {
      const result = await transcribeAudio(file);
      setTranscription(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Si è verificato un errore sconosciuto');
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setTranscription('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-12 text-center space-y-4 max-w-2xl">
          <div className="inline-flex items-center justify-center p-3 bg-brand-500/10 rounded-2xl mb-2 border border-brand-500/20">
            <AudioFileIcon className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-200 to-brand-400 tracking-tight">
            AudioScribe AI
          </h1>
          <p className="text-lg text-gray-400">
            Trascrivi istantaneamente riunioni, note vocali e interviste direttamente dal tuo dispositivo usando Gemini.
          </p>
        </div>

        {/* Dynamic Content Area */}
        <div className="w-full max-w-3xl transition-all duration-500 ease-in-out">
          
          {appState === AppState.IDLE && (
            <div 
              className="group relative border-2 border-dashed border-gray-700 hover:border-brand-500 hover:bg-gray-900/50 bg-gray-900/30 rounded-3xl p-12 text-center transition-all cursor-pointer"
              onClick={triggerUpload}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="audio/*"
              />
              
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl group-hover:shadow-brand-500/20">
                  <UploadIcon className="w-10 h-10 text-gray-400 group-hover:text-brand-400 transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">Tocca per caricare l'audio</h3>
                  <p className="text-gray-400 text-sm">MP3, WAV, M4A (Max 20MB)</p>
                </div>

                <div className="bg-brand-600 text-white px-6 py-2 rounded-full font-medium text-sm shadow-lg shadow-brand-600/30 group-hover:bg-brand-500 transition-colors">
                  Seleziona File
                </div>
              </div>
            </div>
          )}

          {appState === AppState.PROCESSING && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 shadow-2xl">
              <ProcessingState />
            </div>
          )}

          {appState === AppState.SUCCESS && (
            <ResultDisplay text={transcription} onReset={handleReset} />
          )}

          {appState === AppState.ERROR && (
             <div className="bg-red-950/30 border border-red-900/50 rounded-3xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Trascrizione Fallita</h3>
                <p className="text-red-200 mb-6">{errorMsg}</p>
                <button 
                  onClick={handleReset}
                  className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Riprova
                </button>
             </div>
          )}

        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-gray-600 text-xs">
          Powered by Google Gemini 3 Flash Preview &bull; Privacy Protetta
        </div>
      </main>
    </div>
  );
}

export default App;