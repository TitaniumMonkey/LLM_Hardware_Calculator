import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface ModelInputProps {
  onSubmit: (link: string) => void;
  isLoading: boolean;
}

const ModelInput: React.FC<ModelInputProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  // Examples for the dropdown
  const examples = [
    'meta-llama/Llama-2-7b',
    'mistralai/Mistral-7B-v0.1',
    'google/gemma-7b',
    'microsoft/phi-2',
    'google/flan-t5-xxl',
    'HuggingFaceH4/zephyr-7b-beta'
  ];

  const handleExampleClick = (example: string) => {
    const link = `https://huggingface.co/${example}`;
    setInputValue(link);
    onSubmit(link);
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg transition-all hover:shadow-blue-900/10">
      <h2 className="text-xl font-semibold mb-4 text-slate-200">Model Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-slate-600 text-slate-300 transition-all"
            placeholder="Enter Hugging Face model link (e.g., https://huggingface.co/meta-llama/Llama-2-7b)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:pointer-events-none"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            'Calculate Requirements'
          )}
        </button>
      </form>
      
      <div className="mt-4">
        <p className="text-sm text-slate-500 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="text-xs py-1 px-3 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelInput;