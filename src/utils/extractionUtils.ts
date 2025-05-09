import { ModelData } from '../types/model';

export async function extractModelInfo(url: string, hfApiKey?: string): Promise<ModelData> {
  let modelId = url;
  if (url.includes('huggingface.co')) {
    modelId = url.split('huggingface.co/')[1];
  }
  modelId = modelId.replace(/\/$/, '');

  let parameters = 0;
  let parametersFormatted = '';
  let quantization = '';
  let contextLength = 2048;
  let architecture = 'Unknown';
  let license = 'Unknown';

  try {
    const headers: Record<string, string> = {};
    if (hfApiKey) {
      headers['Authorization'] = `Bearer ${hfApiKey}`;
    }

    // Fetch model info from Hugging Face API
    const configRes = await fetch(`https://huggingface.co/api/models/${modelId}`, { headers });
    if (!configRes.ok) throw new Error('Could not fetch model config from Hugging Face');
    const config = await configRes.json();

    // --- Parameter size and quantization extraction from safetensors.parameters ---
    if (config.safetensors?.parameters && typeof config.safetensors.parameters === 'object') {
      const paramKeys = Object.keys(config.safetensors.parameters);
      if (paramKeys.length > 0) {
        const quantKey = paramKeys[0];
        const paramCount = config.safetensors.parameters[quantKey];
        parameters = paramCount;
        quantization = quantKey.toUpperCase();
        parametersFormatted = parameters >= 1e9
          ? `${(parameters / 1e9).toFixed(2)}B`
          : parameters >= 1e6
            ? `${(parameters / 1e6).toFixed(2)}M`
            : parameters.toString();
      }
    }

    // --- Fallback: Try cardData.parameters (string like "752M params" or "8.54B params") ---
    if (!parameters && config.cardData?.parameters) {
      const match = config.cardData.parameters.match(/([\d.]+)\s*([MB])\s*params?/i);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        parameters = unit === 'B' ? Math.round(num * 1_000_000_000) : Math.round(num * 1_000_000);
        parametersFormatted = `${num}${unit}`;
      }
    }

    // --- Fallback: Try modelId or model name (e.g., "7b", "0.6b", "752m") ---
    if (!parameters && config.modelId) {
      const match = config.modelId.match(/([\d.]+)\s*([MB])\b/i);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        parameters = unit === 'B' ? Math.round(num * 1_000_000_000) : Math.round(num * 1_000_000);
        parametersFormatted = `${num}${unit}`;
      }
    }
    // Try model name as last resort
    if (!parameters) {
      const nameParts = modelId.split('/');
      const modelName = nameParts.length > 1 ? nameParts[1] : modelId;
      const match = modelName.match(/([\d.]+)\s*([MB])\b/i);
      if (match) {
        const num = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        parameters = unit === 'B' ? Math.round(num * 1_000_000_000) : Math.round(num * 1_000_000);
        parametersFormatted = `${num}${unit}`;
      }
    }

    // --- Quantization extraction fallback ---
    if (!quantization) {
      if (config.safetensors?.tensor_type) {
        quantization = config.safetensors.tensor_type.toUpperCase();
      } else if (config.cardData?.quantization) {
        quantization = config.cardData.quantization.toUpperCase();
      } else if (url.match(/(int8|int4|gptq|awq|gguf|bf16|fp16|fp32)/i)) {
        quantization = url.match(/(int8|int4|gptq|awq|gguf|bf16|fp16|fp32)/i)![1].toUpperCase();
      } else {
        quantization = 'FP16';
      }
    }

    // --- Context length ---
    if (config.cardData?.context_length) {
      contextLength = parseInt(config.cardData.context_length, 10);
    } else if (config.cardData?.contextLength) {
      contextLength = parseInt(config.cardData.contextLength, 10);
    }

    // --- Architecture ---
    if (config.pipeline_tag) {
      architecture = config.pipeline_tag;
    }

    // --- License ---
    if (config.license) {
      license = config.license;
    }

    // --- Error if still missing parameters ---
    if (!parameters) {
      throw new Error('Could not determine model parameter size from Hugging Face. Please enter manually.');
    }
  } catch (err) {
    throw new Error('Could not fetch model info from Hugging Face. Please check your API key or enter info manually.');
  }

  // Extract model name
  const nameParts = modelId.split('/');
  const modelName = nameParts.length > 1 ? nameParts[1] : modelId;

  return {
    id: modelId,
    name: modelName,
    huggingFaceUrl: `https://huggingface.co/${modelId}`,
    parameters,
    parametersFormatted,
    quantization,
    architecture,
    contextLength,
    license
  };
}