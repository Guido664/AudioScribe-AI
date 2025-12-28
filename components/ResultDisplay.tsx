import React, { useState } from 'react';
import { CopyIcon, CheckIcon, RefreshIcon } from './Icons';

interface ResultDisplayProps {
  text: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ text, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Transcription Result</h2>
        <div className="flex space-x-2">
           <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors text-sm font-medium border border-gray-700"
          >
            {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors text-sm font-medium"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>New Upload</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl">
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap leading-relaxed text-gray-200">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};