import React, { useState } from 'react';
import ModelInput from './ModelInput';
import ManualInput from './ManualInput';
import ModelInfo from './ModelInfo';
import RequirementsDisplay from './RequirementsDisplay';
import { calculateRequirements } from '../utils/calculationUtils';
import { ModelData } from '../types/model';
import { extractModelInfo } from '../utils/extractionUtils';

const Calculator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelLink, setModelLink] = useState('');
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hfApiKey, setHfApiKey] = useState('');

  const handleModelSubmit = async (link: string) => {
    setIsLoading(true);
    setError(null);
    setModelData(null);
    setModelLink(link);

    try {
      const modelInfo = await extractModelInfo(link, hfApiKey);
      setModelData(modelInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model information');
      setModelData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (params: { size: number; quantType: string }) => {
    setError(null);
    setModelData(null);
    const manualModelData: ModelData = {
      id: 'manual-input',
      name: 'Manual Input',
      huggingFaceUrl: '',
      parameters: params.size * 1_000_000_000,
      parametersFormatted: `${params.size}B`,
      quantization: params.quantType,
      architecture: 'Custom',
      contextLength: 2048,
      license: 'Custom'
    };
    setModelData(manualModelData);
  };

  const requirementsData = modelData ? calculateRequirements(modelData) : null;

  const findGpuCombinations = (requiredVram: number): Array<{combo: string, totalVram: number, baseName: string}> => {
    const combinations: Array<{combo: string, totalVram: number, baseName: string}> = [];
    for (const gpu of sortedGpus) {
      for (const numGpus of [2, 4, 8]) {
        const totalVram = numGpus * gpu.vram;
        if (totalVram >= requiredVram && gpu.vram < requiredVram) {
          combinations.push({
            combo: `${numGpus}x ${gpu.name} - Tensor Parallel`,
            totalVram,
            baseName: gpu.name
          });
          break; // Only show the smallest valid combination for each GPU
        }
      }
    }
    return combinations;
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      <ModelInput
        onSubmit={handleModelSubmit}
        isLoading={isLoading}
        apiKey={hfApiKey}
        setApiKey={setHfApiKey}
      />
      <ManualInput onSubmit={handleManualSubmit} />
      
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200">
          <p>{error}</p>
        </div>
      )}
      
      {modelData && (
        <div className="space-y-6">
          <ModelInfo modelData={modelData} />
          <RequirementsDisplay requirementsData={requirementsData} />
        </div>
      )}
    </div>
  );
};

export default Calculator;