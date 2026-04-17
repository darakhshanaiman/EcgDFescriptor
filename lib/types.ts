export type LifelineChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export type LifelineChatSession = {
  id: string;
  createdAt: number;
  updatedAt: number;
  ecgFlowStep: 'upload' | 'processing' | 'chat';
  ecgImageDataUrl: string | null;
  ecgFileName: string;
  ecgDescription: string;
  messages: LifelineChatMessage[];
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
};
