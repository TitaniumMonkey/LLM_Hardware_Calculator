export interface ModelData {
  id: string;
  name: string;
  huggingFaceUrl: string;
  parameters: number;
  parametersFormatted: string;
  quantization: string;
  architecture: string;
  contextLength: number;
  license: string;
}

export interface Requirements {
  vramRequired: number;
  storageRequired: number;
  recommendedGpu: string;
  minimumGpu: string;
}