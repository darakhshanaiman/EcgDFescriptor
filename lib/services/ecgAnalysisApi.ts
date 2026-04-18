export type AnalyzeEcgResponse = {
  status: 'success';
  analysis: {
    diagnosis: string;
    confidence: number;
    findings: string[];
    recommendation: string;
  };
};

export type DynamicAnalyzeEcgResponse = {
  status: 'success';
  description: string;
  raw_result: unknown;
};

export type FastApiHealthResponse = {
  status: 'ok' | 'degraded';
  service: string;
  sdk_configured: boolean;
  lifeline_upstream_reachable: boolean;
};

export type ChatEcgHistoryMessage = {
  role: 'user' | 'ai';
  content: string;
};

export type ChatEcgResponse = {
  status: 'success';
  answer: string;
};

type AnalyzeEcgFileOptions = {
  onUploadProgress?: (percent: number) => void;
  signal?: AbortSignal;
};

const LIFELINE_OFFLINE_MESSAGE =
  'Lifeline service is temporarily unavailable. Please try again in a few minutes.';

const FASTAPI_BASE_URL =
  process.env.EXPO_PUBLIC_FASTAPI_URL || 'https://api.srpsolutions.pk';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

function isLifelineUnavailableStatus(status: number): boolean {
  return status === 503 || status === 502;
}

function normalizeLifelineErrorMessage(message: string, status?: number): string {
  const lowerMessage = message.toLowerCase();
  if (
    isLifelineUnavailableStatus(status || 0) ||
    lowerMessage.includes('service unavailable') ||
    lowerMessage.includes('temporarily unavailable') ||
    lowerMessage.includes('network error') ||
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('timeout')
  ) {
    return LIFELINE_OFFLINE_MESSAGE;
  }
  return message;
}

async function parseApiError(response: Response): Promise<Error> {
  try {
    const data = await response.json();
    const rawMessage = data?.error?.message || 'Failed to analyze ECG';
    return new Error(normalizeLifelineErrorMessage(rawMessage, response.status));
  } catch {
    if (isLifelineUnavailableStatus(response.status)) {
      return new Error(LIFELINE_OFFLINE_MESSAGE);
    }
    return new Error('Failed to analyze ECG');
  }
}

type ImageFileInput = {
  uri: string;
  type: string;
  name: string;
};

export async function analyzeEcgFile(
  imageFile: ImageFileInput,
  options: AnalyzeEcgFileOptions = {},
): Promise<AnalyzeEcgResponse> {
  if (!ALLOWED_IMAGE_TYPES.has(imageFile.type)) {
    throw new Error('Unsupported image type. Use PNG, JPG, JPEG, or WEBP.');
  }

  const formData = new FormData();
  formData.append('image_file', imageFile as any);

  let response: Response;
  try {
    response = await fetch(`${FASTAPI_BASE_URL}/analyze-ecg`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(LIFELINE_OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json();
}

export async function analyzeEcgUrl(
  imageUrl: string,
): Promise<AnalyzeEcgResponse> {
  let response: Response;
  try {
    response = await fetch(`${FASTAPI_BASE_URL}/analyze-ecg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });
  } catch {
    throw new Error(LIFELINE_OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json();
}

export async function analyzeEcgFileDynamic(
  imageFile: ImageFileInput,
  prompt: string,
  context?: string,
): Promise<DynamicAnalyzeEcgResponse> {
  const formData = new FormData();
  formData.append('image_file', imageFile as any);
  formData.append('prompt', prompt);
  if (context) {
    formData.append('context', context);
  }

  let response: Response;
  try {
    response = await fetch(`${FASTAPI_BASE_URL}/analyze-ecg-dynamic`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(LIFELINE_OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json() as Promise<DynamicAnalyzeEcgResponse>;
}

export async function chatEcgWithContext(
  description: string,
  prompt: string,
  previousMessages: ChatEcgHistoryMessage[],
): Promise<ChatEcgResponse> {
  let response: Response;
  try {
    response = await fetch(`${FASTAPI_BASE_URL}/chat-ecg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        prompt,
        previous_messages: previousMessages,
      }),
    });
  } catch {
    throw new Error(LIFELINE_OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json() as Promise<ChatEcgResponse>;
}

export async function checkFastApiHealth(): Promise<FastApiHealthResponse> {
  let response: Response;
  try {
    response = await fetch(`${FASTAPI_BASE_URL}/health`, {
      method: 'GET',
    });
  } catch {
    throw new Error(LIFELINE_OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    throw new Error('FastAPI health check failed.');
  }

  return response.json() as Promise<FastApiHealthResponse>;
}

export function formatEcgAssistantMessage(result: AnalyzeEcgResponse): string {
  const findings = result.analysis.findings.length
    ? result.analysis.findings.map((item) => `- ${item}`).join('\n')
    : '- No major findings detected.';

  return `ECG analysis (confidence ${(result.analysis.confidence * 100).toFixed(0)}%)\n\nDiagnosis:\n${result.analysis.diagnosis}\n\nFindings:\n${findings}\n\nRecommendation:\n${result.analysis.recommendation}`;
}