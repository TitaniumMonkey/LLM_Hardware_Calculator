// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Format byte sizes to human-readable format
export function formatSize(sizeInGB: number): string {
  if (sizeInGB < 1) {
    return `${Math.round(sizeInGB * 1024)} MB`;
  }
  return `${sizeInGB.toFixed(1)} GB`;
}