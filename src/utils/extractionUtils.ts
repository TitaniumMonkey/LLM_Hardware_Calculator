import { ModelData } from '../types/model';

// For demo purposes only - in a real app, this would actually fetch from Hugging Face API
export async function extractModelInfo(url: string): Promise<ModelData> {
  // Extract model ID from URL if needed
  let modelId = url;
  
  // If it's a Hugging Face URL, extract the model ID
  if (url.includes('huggingface.co')) {
    modelId = url.split('huggingface.co/')[1];
  }
  
  // Remove trailing slashes
  modelId = modelId.replace(/\/$/, '');
  
  // This would normally be a fetch to the Hugging Face API
  // For demo purposes, we're mocking the response
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      if (!modelId) {
        reject(new Error('Invalid model link'));
        return;
      }
      
      // Extract the model name from the ID
      const nameParts = modelId.split('/');
      const modelName = nameParts.length > 1 ? nameParts[1] : modelId;
      
      // Try to extract parameter size from model name
      let parameters = 0;
      let parametersFormatted = '';
      
      if (modelName.includes('7b') || modelName.toLowerCase().includes('7-b')) {
        parameters = 7_000_000_000;
        parametersFormatted = '7B';
      } else if (modelName.includes('13b') || modelName.toLowerCase().includes('13-b')) {
        parameters = 13_000_000_000;
        parametersFormatted = '13B';
      } else if (modelName.includes('70b') || modelName.toLowerCase().includes('70-b')) {
        parameters = 70_000_000_000;
        parametersFormatted = '70B';
      } else if (modelName.includes('llama-2')) {
        // Default to Llama 2 7B if not specified
        parameters = 7_000_000_000;
        parametersFormatted = '7B';
      } else {
        // Random model size for unknown models
        const sizes = [7, 13, 34, 70];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        parameters = randomSize * 1_000_000_000;
        parametersFormatted = `${randomSize}B`;
      }
      
      // Determine architecture based on model name
      let architecture = 'Unknown';
      if (modelName.toLowerCase().includes('llama')) {
        architecture = 'Llama';
      } else if (modelName.toLowerCase().includes('mistral')) {
        architecture = 'Mistral';
      } else if (modelName.toLowerCase().includes('gemma')) {
        architecture = 'Gemma';
      } else if (modelName.toLowerCase().includes('phi')) {
        architecture = 'Phi';
      } else if (modelName.toLowerCase().includes('t5')) {
        architecture = 'T5';
      } else if (modelName.toLowerCase().includes('zephyr')) {
        architecture = 'Zephyr';
      }
      
      // Determine quantization based on URL path
      let quantization = 'FP16'; // default
      if (url.includes('int8') || url.includes('INT8')) {
        quantization = 'INT8';
      } else if (url.includes('int4') || url.includes('INT4')) {
        quantization = 'INT4';
      } else if (url.includes('gptq') || url.includes('GPTQ')) {
        quantization = 'GPTQ';
      } else if (url.includes('awq') || url.includes('AWQ')) {
        quantization = 'AWQ';
      } else if (url.includes('gguf') || url.includes('GGUF')) {
        quantization = 'GGUF';
      }
      
      // Context length based on model
      let contextLength = 2048;
      if (architecture === 'Llama' || architecture === 'Mistral') {
        contextLength = 4096;
      } else if (architecture === 'Gemma') {
        contextLength = 8192;
      }
      
      // Determine license
      let license = 'Unknown';
      if (modelId.includes('meta-llama')) {
        license = 'Meta Llama 2 License';
      } else if (modelId.includes('mistralai')) {
        license = 'Apache 2.0';
      } else if (modelId.includes('google')) {
        license = 'Google Proprietary';
      } else {
        license = 'Apache 2.0';
      }
      
      resolve({
        id: modelId,
        name: modelName,
        huggingFaceUrl: `https://huggingface.co/${modelId}`,
        parameters,
        parametersFormatted,
        quantization,
        architecture,
        contextLength,
        license
      });
    }, 1000); // Simulate 1 second API delay
  });
}