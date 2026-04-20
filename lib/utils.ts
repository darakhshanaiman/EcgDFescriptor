export function formatHeartRate(bpm?: number | null): string {
  if (bpm === undefined || bpm === null) {
    return 'N/A';
  }
  return `${Math.round(bpm)} bpm`;
}

export function validateEcgData(data: any): boolean {
  if (!data) return false;
  
  if (data.heartRate === undefined || data.heartRate === null) {
    return false;
  }
  
  if (data.dataPoints !== undefined && !Array.isArray(data.dataPoints)) {
    return false;
  }
  
  return true;
}

export function formatTimestamp(timestamp: number | string | Date): string {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return 'Invalid Date';
  }
}

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>]/g, '').trim();
}
