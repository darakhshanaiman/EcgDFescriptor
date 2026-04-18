export type LifelineChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export type EcgAnalysisResult = {
  rhythm: string;
  heartRate: number;
  intervals: {
    pr: string;
    qrs: string;
    qtc: string;
  };
  findings: string[];
  impression: string;
};

export type LifelineChatSession = {
  id: string;
  createdAt: number;
  updatedAt: number;
  ecgFlowStep: 'welcome' | 'upload' | 'processing' | 'preview' | 'report' | 'chat';
  ecgImageDataUrl: string | null;
  ecgFileName: string;
  ecgDescription: string;
  messages: LifelineChatMessage[];
  analysisResult?: EcgAnalysisResult;
};

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: number;
};
