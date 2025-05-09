import React, { useState } from 'react';
import ModelInput from './ModelInput';
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

  const handleModelSubmit = async (link: string) => {
    setIsLoading(true);
    setError(null);
    setModelLink(link);
    
    try {
      // In a real app, this would fetch from the Hugging Face API
      // For this demo, we'll use a mock extraction
      const modelInfo = await extractModelInfo(link);
      setModelData(modelInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model information');
      setModelData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const requirementsData = modelData ? calculateRequirements(modelData) : null;

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      <ModelInput onSubmit={handleModelSubmit} isLoading={isLoading} />
      
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