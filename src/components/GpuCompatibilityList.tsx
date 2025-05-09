import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface GpuCompatibilityListProps {
  vramRequired: number;
}

interface GpuModel {
  name: string;
  vram: number;
  tier: 'consumer' | 'professional' | 'datacenter';
}

const GpuCompatibilityList: React.FC<GpuCompatibilityListProps> = ({ vramRequired }) => {
  // Common GPU models with their VRAM capacities
  const gpuModels: GpuModel[] = [
    { name: 'NVIDIA RTX 3060', vram: 12, tier: 'consumer' },
    { name: 'NVIDIA RTX 3080', vram: 10, tier: 'consumer' },
    { name: 'NVIDIA RTX 3090', vram: 24, tier: 'consumer' },
    { name: 'NVIDIA RTX 4060', vram: 8, tier: 'consumer' },
    { name: 'NVIDIA RTX 4070', vram: 12, tier: 'consumer' },
    { name: 'NVIDIA RTX 4080', vram: 16, tier: 'consumer' },
    { name: 'NVIDIA RTX 4090', vram: 24, tier: 'consumer' },
    { name: 'NVIDIA A100', vram: 40, tier: 'datacenter' },
    { name: 'NVIDIA A6000', vram: 48, tier: 'professional' },
    { name: 'NVIDIA L4', vram: 24, tier: 'datacenter' },
    { name: 'AMD Radeon RX 6900 XT', vram: 16, tier: 'consumer' },
    { name: 'AMD Radeon RX 7900 XTX', vram: 24, tier: 'consumer' },
  ];

  // Filter compatible GPUs
  const compatibleGpus = gpuModels.filter(gpu => gpu.vram >= vramRequired);
  const incompatibleGpus = gpuModels.filter(gpu => gpu.vram < vramRequired);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-900/10 transition-all">
      <h2 className="text-xl font-semibold mb-4 text-slate-200">GPU Compatibility</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compatible GPUs */}
        <div>
          <h3 className="text-md font-medium text-green-400 mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Compatible GPUs
          </h3>
          
          {compatibleGpus.length > 0 ? (
            <ul className="space-y-2">
              {compatibleGpus.map(gpu => (
                <li key={gpu.name} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-200">{gpu.name}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    gpu.tier === 'consumer' ? 'bg-blue-900/30 text-blue-300' :
                    gpu.tier === 'professional' ? 'bg-purple-900/30 text-purple-300' :
                    'bg-indigo-900/30 text-indigo-300'
                  }`}>
                    {gpu.vram} GB
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic">No compatible consumer GPUs found</p>
          )}
        </div>
        
        {/* Incompatible GPUs */}
        <div>
          <h3 className="text-md font-medium text-red-400 mb-3 flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Incompatible GPUs
          </h3>
          
          <ul className="space-y-2">
            {incompatibleGpus.map(gpu => (
              <li key={gpu.name} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg opacity-70">
                <span className="text-slate-400">{gpu.name}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-red-900/30 text-red-300">
                  {gpu.vram} GB
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GpuCompatibilityList;