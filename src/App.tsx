import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Calculator from './components/Calculator';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 flex flex-col items-center">
        <header className="w-full py-6 px-4 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            LLM Hardware Calculator
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Calculate VRAM and storage requirements for Large Language Models based on Hugging Face model cards
          </p>
        </header>
        <main className="flex-1 w-full max-w-6xl px-4 pb-12">
          <Calculator />
        </main>
        <footer className="w-full py-4 text-center text-slate-500 text-sm">
          <p>
            © 2025 LLM VRAM Calculator |
            <a href="https://github.com/TitaniumMonkey/LLM_Hardware_Calculator" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors"> https://github.com/TitaniumMonkey/LLM_Hardware_Calculator</a> |
            Contact: <a href="mailto:tpierce@Titanium-Monkey.com" className="text-blue-400 hover:text-blue-300 transition-colors">tpierce@Titanium-Monkey.com</a>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
