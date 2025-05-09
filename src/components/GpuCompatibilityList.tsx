import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface GpuCompatibilityListProps {
  vramRequired: number;
}

interface GpuModel {
  name: string;
  vram: number;
  tier: 'consumer' | 'professional' | 'datacenter';
  max_gpus: number;
}

const GpuCompatibilityList: React.FC<GpuCompatibilityListProps> = ({ vramRequired }) => {
  // Add max_gpus for each GPU based on real-world support
  const gpuModels: GpuModel[] = [
    { name: 'NVIDIA H100', vram: 80, tier: 'datacenter', max_gpus: 8 },
    { name: 'NVIDIA H200', vram: 141, tier: 'datacenter', max_gpus: 8 },
    { name: 'NVIDIA B200', vram: 192, tier: 'datacenter', max_gpus: 8 },
    { name: 'NVIDIA A100', vram: 80, tier: 'datacenter', max_gpus: 8 },
    { name: 'NVIDIA A6000', vram: 48, tier: 'professional', max_gpus: 4 },
    { name: 'NVIDIA A40', vram: 48, tier: 'professional', max_gpus: 4 },
    { name: 'NVIDIA L40', vram: 48, tier: 'professional', max_gpus: 4 },
    { name: 'NVIDIA L40S', vram: 48, tier: 'professional', max_gpus: 4 },
    { name: 'NVIDIA RTX 6000 Ada', vram: 48, tier: 'professional', max_gpus: 4 },
    { name: 'NVIDIA RTX 4090', vram: 24, tier: 'consumer', max_gpus: 2 },
    { name: 'NVIDIA RTX 3090', vram: 24, tier: 'consumer', max_gpus: 2 },
    { name: 'NVIDIA RTX A5000', vram: 24, tier: 'professional', max_gpus: 2 },
    { name: 'NVIDIA L4', vram: 24, tier: 'datacenter', max_gpus: 2 },
    { name: 'NVIDIA RTX 4000', vram: 16, tier: 'consumer', max_gpus: 2 },
    { name: 'NVIDIA A4000', vram: 16, tier: 'professional', max_gpus: 2 },
    { name: 'NVIDIA RTX 4070', vram: 12, tier: 'consumer', max_gpus: 2 },
    { name: 'NVIDIA RTX 4060', vram: 8, tier: 'consumer', max_gpus: 2 },
    { name: 'NVIDIA RTX 3080', vram: 10, tier: 'consumer', max_gpus: 2 },
    { name: 'AMD Radeon RX 7900 XTX', vram: 24, tier: 'consumer', max_gpus: 2 },
    { name: 'AMD Radeon RX 6900 XT', vram: 16, tier: 'consumer', max_gpus: 2 },
    { name: 'NVIDIA RTX 5090', vram: 32, tier: 'consumer', max_gpus: 2 },
  ];

  // Sort GPUs by VRAM size
  const sortedGpus = [...gpuModels].sort((a, b) => b.vram - a.vram);

  // Find compatible single GPUs
  const compatibleSingleGpus = sortedGpus.filter(gpu => gpu.vram >= vramRequired);

  // For each GPU, if single GPU is not compatible, find the smallest valid multi-GPU combo (2x, 4x, 8x) up to max_gpus
  const multiGpuCombos = [2, 4, 8];
  const compatibleMultiGpuCombos = sortedGpus.flatMap(gpu => {
    if (gpu.vram >= vramRequired) return []; // Skip if single GPU is already compatible
    for (const numGpus of multiGpuCombos) {
      if (numGpus > gpu.max_gpus) continue;
      if (gpu.vram * numGpus >= vramRequired) {
        return [{
          combo: `${numGpus}x ${gpu.name} - Tensor Parallel`,
          totalVram: gpu.vram * numGpus,
          baseName: gpu.name,
          numGpus
        }];
      }
    }
    return [];
  });

  // Collect all GPU names used in any compatible solution
  const usedGpuNames = new Set<string>([
    ...compatibleSingleGpus.map(gpu => gpu.name),
    ...compatibleMultiGpuCombos.map(combo => combo.baseName)
  ]);

  // Only show GPUs as incompatible if they are not used in any compatible solution
  const incompatibleGpus = sortedGpus.filter(
    gpu => gpu.vram < vramRequired && !usedGpuNames.has(gpu.name)
  );

  return (
    <div className="space-y-6">
      {/* Compatible GPUs Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-blue-900/10 transition-all">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">GPU Compatibility</h2>
        
        <div className="space-y-6">
          {/* Single GPU Solutions */}
          <div>
            <h3 className="text-lg font-medium text-slate-300 mb-3">Single GPU Solutions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {compatibleSingleGpus.map((gpu) => (
                <div
                  key={gpu.name}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-slate-200 font-medium">{gpu.name}</span>
                  </div>
                  <span className="text-slate-400 text-sm">{gpu.vram}GB VRAM</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-GPU Solutions */}
          {compatibleMultiGpuCombos.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-slate-300 mb-3">Multi-GPU Solutions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {compatibleMultiGpuCombos.map(({combo, totalVram}) => (
                  <div
                    key={combo}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-slate-200 font-medium">{combo}</span>
                    </div>
                    <span className="text-slate-400 text-sm">{totalVram}GB Total VRAM</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Incompatible GPUs Section */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-medium text-slate-400 mb-3">Incompatible GPUs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {incompatibleGpus.map((gpu) => (
            <div
              key={gpu.name}
              className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center">
                <XCircle className="h-4 w-4 text-red-500/70 mr-2" />
                <span className="text-slate-400 text-sm">{gpu.name}</span>
              </div>
              <span className="text-slate-500 text-xs">{gpu.vram}GB VRAM</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GpuCompatibilityList;