import { ModelData, Requirements } from '../types/model';

// Calculate VRAM and storage requirements based on model parameters and quantization
export function calculateRequirements(modelData: ModelData): Requirements {
  // Constants for calculation
  const BYTES_PER_PARAMETER = {
    'FP32': 4,
    'FP16': 2,
    'INT8': 1,
    'INT4': 0.5,
    'GPTQ': 0.5,
    'AWQ': 0.5,
    'GGUF': 0.5,
  };
  
  // Default to FP16 if quantization not specified
  const bytesPerParam = BYTES_PER_PARAMETER[modelData.quantization as keyof typeof BYTES_PER_PARAMETER] || 2;
  
  // Calculate base VRAM for model parameters
  const baseVram = (modelData.parameters * bytesPerParam) / 1_000_000_000;
  
  // Calculate KV cache memory
  const hiddenSize = modelData.hiddenSize || 4096;
  const numLayers = modelData.numLayers || 32;
  const contextLength = modelData.contextLength || 2048;
  const batchSize = modelData.batchSize || 1;
  
  // KV cache calculation (2 * hidden_size * num_layers * context_length * batch_size * bytes_per_param)
  const kvCacheVram = (2 * hiddenSize * numLayers * contextLength * batchSize * bytesPerParam) / 1_000_000_000;
  
  // Add overhead for gradients and optimizer states (typically 2x for Adam optimizer)
  const optimizerOverhead = baseVram * 2;
  
  // Total VRAM required
  const vramRequired = Math.ceil(baseVram + kvCacheVram + optimizerOverhead);
  
  // Calculate storage in GB (model size + 10% overhead)
  const storageRequired = Math.ceil(baseVram * 1.1);
  
  // Determine recommended GPUs based on VRAM requirements
  let recommendedGpu = 'Not enough information';
  let minimumGpu = 'Not enough information';
  
  if (vramRequired <= 8) {
    recommendedGpu = 'NVIDIA RTX 3070 or better';
    minimumGpu = 'NVIDIA RTX 3060';
  } else if (vramRequired <= 12) {
    recommendedGpu = 'NVIDIA RTX 3080 Ti or better';
    minimumGpu = 'NVIDIA RTX 3060 Ti';
  } else if (vramRequired <= 16) {
    recommendedGpu = 'NVIDIA RTX 4080 or better';
    minimumGpu = 'NVIDIA RTX 3090';
  } else if (vramRequired <= 24) {
    recommendedGpu = 'NVIDIA RTX 4090 or better';
    minimumGpu = 'NVIDIA RTX 3090 Ti';
  } else if (vramRequired <= 48) {
    recommendedGpu = 'NVIDIA A6000 or better';
    minimumGpu = 'NVIDIA A100';
  } else {
    recommendedGpu = 'Multiple GPUs or specialized hardware required';
    minimumGpu = 'NVIDIA A100 80GB or multiple GPUs';
  }
  
  return {
    vramRequired,
    storageRequired,
    recommendedGpu,
    minimumGpu
  };
}