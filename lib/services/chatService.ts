export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPayload {
  messages: ChatMessage[];
}

export class ChatServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export const createMessagePayload = (message: string, history: ChatMessage[] = []): ChatPayload => {
  return {
    messages: [
      ...history,
      { role: 'user', content: message }
    ]
  };
};

export const sendMessageToApi = async (payload: ChatPayload, token: string): Promise<string> => {
  let response: Response;
  try {
    response = await fetch('https://api.example.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('network')) {
      throw new ChatServiceError('Offline: No network connection available.', 0);
    }
    throw new ChatServiceError('Network request failed.', 0);
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new ChatServiceError('Unauthorized error: Invalid or expired token.', 401);
    }
    throw new ChatServiceError(`API error: ${response.status}`, response.status);
  }

  const data = await response.json();

  if (!data || !data.reply || typeof data.reply !== 'string' || data.reply.trim() === '') {
    throw new ChatServiceError('Empty response handling: The server returned an empty response.');
  }

  return data.reply;
};
