import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from '../firebase';

const FASTAPI_BASE_URL =
  process.env.EXPO_PUBLIC_FASTAPI_URL || 'https://api.srpsolutions.pk';

export type GenerateLifelineApiKeyResponse = {
  status: 'success';
  api_key: string;
};

const LIFELINE_OFFLINE_MESSAGE =
  'Lifeline service is temporarily unavailable. Please try again in a few minutes.';

function isLifelineUnavailableStatus(status: number): boolean {
  return status === 503 || status === 502;
}

function normalizeApiKeyErrorMessage(message: string, status?: number): string {
  const lower = message.toLowerCase();
  if (
    isLifelineUnavailableStatus(status || 0) ||
    lower.includes('service unavailable') ||
    lower.includes('temporarily unavailable') ||
    lower.includes('failed to fetch') ||
    lower.includes('network error') ||
    lower.includes('timeout')
  ) {
    return LIFELINE_OFFLINE_MESSAGE;
  }
  return message;
}

export async function generateLifelineApiKey(): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${FASTAPI_BASE_URL}/generate-api-key`, {
      method: 'POST',
    });
  } catch {
    throw new Error(LIFELINE_OFFLINE_MESSAGE);
  }

  if (!response.ok) {
    try {
      const data = await response.json();
      const rawMessage = data?.error?.message || 'Failed to generate API key';
      throw new Error(normalizeApiKeyErrorMessage(rawMessage, response.status));
    } catch {
      if (isLifelineUnavailableStatus(response.status)) {
        throw new Error(LIFELINE_OFFLINE_MESSAGE);
      }
      throw new Error('Failed to generate API key');
    }
  }

  const data = (await response.json()) as GenerateLifelineApiKeyResponse;
  if (!data.api_key) {
    throw new Error('No API key returned from server');
  }

  return data.api_key;
}

function userDocRef(userId: string) {
  return doc(db, 'users', userId);
}

export async function saveUserApiKey(
  userId: string,
  email: string,
  apiKey: string,
): Promise<void> {
  await setDoc(
    userDocRef(userId),
    {
      email,
      apiKey,
      apiKeyUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function loadUserApiKey(userId: string): Promise<string> {
  const snapshot = await getDoc(userDocRef(userId));
  const data = snapshot.data();
  const apiKey = data?.apiKey;
  return typeof apiKey === 'string' ? apiKey : '';
}