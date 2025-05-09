import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';

interface ManualInputProps {
  onSubmit: (params: {
    size: number;
    quantType: string;
    contextLength?: number;
    hiddenSize?: number;
    numLayers?: number;
    batchSize?: number;
  }) => void;
}

const ManualInput: React.FC<ManualInputProps> = ({ onSubmit }) => {
  const [size, setSize] = useState<string>('');
  const [sizeUnit, setSizeUnit] = useState<'M' | 'B'>('B');
  const [quantType, setQuantType] = useState<string>('FP16');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced parameters
  const [contextLength, setContextLength] = useState<string>('2048');
  const [hiddenSize, setHiddenSize] = useState<string>('4096');
  const [numLayers, setNumLayers] = useState<string>('32');
  const [batchSize, setBatchSize] = useState<string>('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericSize = parseFloat(size);
    if (isNaN(numericSize) || numericSize <= 0) return;

    // Convert to billions if needed
    const sizeInBillions = sizeUnit === 'M' ? numericSize / 1000 : numericSize;
    
    onSubmit({
      size: sizeInBillions,
      quantType,
      contextLength: parseInt(contextLength),
      hiddenSize: parseInt(hiddenSize),
      numLayers: parseInt(numLayers),
      batchSize: parseInt(batchSize)
    });
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg transition-all hover:shadow-blue-900/10 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
        <Calculator className="mr-2 h-5 w-5 text-blue-500" />
        Manual Parameters
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Model Size
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                className="flex-1 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
                placeholder="Enter size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <select
                className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as 'M' | 'B')}
              >
                <option value="M">Million</option>
                <option value="B">Billion</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Quantization Type
            </label>
            <select
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
              value={quantType}
              onChange={(e) => setQuantType(e.target.value)}
            >
              <option value="FP32">FP32 (32-bit)</option>
              <option value="FP16">FP16 (16-bit)</option>
              <option value="INT8">INT8 (8-bit)</option>
              <option value="INT4">INT4 (4-bit)</option>
              <option value="GPTQ">GPTQ (4-bit)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {showAdvanced ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Advanced Parameters
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show Advanced Parameters
            </>
          )}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Context Length
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
                value={contextLength}
                onChange={(e) => setContextLength(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Hidden Size
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
                value={hiddenSize}
                onChange={(e) => setHiddenSize(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Number of Layers
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
                value={numLayers}
                onChange={(e) => setNumLayers(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Batch Size
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-300"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                min="1"
              />
            </div>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-colors"
          disabled={!size || parseFloat(size) <= 0}
        >
          Calculate Requirements
        </button>
      </form>
    </div>
  );
};

export default ManualInput; 