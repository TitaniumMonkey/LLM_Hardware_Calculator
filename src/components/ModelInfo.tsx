import React from 'react';
import { ModelData } from '../types/model';
import { formatNumber } from '../utils/formatUtils';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

interface ModelInfoProps {
  modelData: ModelData;
}

const ModelInfo: React.FC<ModelInfoProps> = ({ modelData }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-900/10 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-slate-200 flex items-center">
        <Cpu className="mr-2 h-5 w-5 text-blue-500" />
        Model Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Model Name</h3>
            <p className="text-lg font-semibold text-slate-100">{modelData.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-500">Parameters</h3>
            <p className="text-lg font-semibold text-slate-100">
              {formatNumber(modelData.parameters)} ({modelData.parametersFormatted})
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-500">Quantization</h3>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${modelData.quantization === 'FP16' ? 'bg-purple-900/30 text-purple-300' : 
                  modelData.quantization === 'INT8' ? 'bg-blue-900/30 text-blue-300' : 
                  modelData.quantization === 'INT4' ? 'bg-green-900/30 text-green-300' : 
                  'bg-slate-800 text-slate-300'}`}>
                {modelData.quantization}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Architecture</h3>
            <p className="text-slate-100">{modelData.architecture}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-500">Context Length</h3>
            <p className="text-slate-100">{modelData.contextLength.toLocaleString()} tokens</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-500">License</h3>
            <p className="text-slate-100">{modelData.license}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;