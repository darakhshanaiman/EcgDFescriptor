import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LifelineChatMessage, LifelineChatSession } from '../types';

type ChatSessionsState = {
  activeSessionId: string;
  sessions: LifelineChatSession[];
  isLoaded: boolean;
};

type ChatSessionsContextValue = {
  activeSession: LifelineChatSession | null;
  sessions: LifelineChatSession[];
  activeSessionId: string;
  isLoaded: boolean;
  createNewChat: () => string;
  setActiveChat: (sessionId: string) => void;
  updateActiveChat: (patch: Partial<LifelineChatSession>) => void;
  appendActiveMessage: (message: Omit<LifelineChatMessage, 'id'>) => void;
  resetActiveChat: () => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, newName: string) => void;
};

const STORAGE_SESSIONS_KEY = 'lifeline.chat.sessions.v1';
const STORAGE_ACTIVE_KEY = 'lifeline.chat.activeSessionId.v1';

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      // @ts-ignore
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function newSession(): LifelineChatSession {
  const now = Date.now();
  return {
    id: makeId(),
    createdAt: now,
    updatedAt: now,
    ecgFlowStep: 'upload',
    ecgImageDataUrl: null,
    ecgFileName: '',
    ecgDescription: '',
    messages: [],
  };
}

const ChatSessionsContext = createContext<ChatSessionsContextValue | null>(null);

export function ChatSessionsProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ChatSessionsState>({
    activeSessionId: '',
    sessions: [],
    isLoaded: false,
  });

  // Load data from AsyncStorage on mount
  useEffect(() => {
    async function init() {
      try {
        const [storedSessionsRaw, storedActiveId] = await Promise.all([
          AsyncStorage.getItem(STORAGE_SESSIONS_KEY),
          AsyncStorage.getItem(STORAGE_ACTIVE_KEY),
        ]);

        const storedSessions = safeParseJson<LifelineChatSession[]>(storedSessionsRaw);
        const sessions = Array.isArray(storedSessions) && storedSessions.length > 0
          ? storedSessions
          : [newSession()];

        const activeSessionId =
          (storedActiveId && sessions.some((s) => s.id === storedActiveId)
            ? storedActiveId
            : sessions[0].id) || sessions[0].id;

        setState({ activeSessionId, sessions, isLoaded: true });
      } catch (error) {
        console.error('Failed to load sessions:', error);
        const defaultSession = newSession();
        setState({ activeSessionId: defaultSession.id, sessions: [defaultSession], isLoaded: true });
      }
    }
    init();
  }, []);

  // Persist state changes back to AsyncStorage
  useEffect(() => {
    if (!state.isLoaded) return;

    async function persist() {
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(state.sessions)),
          AsyncStorage.setItem(STORAGE_ACTIVE_KEY, state.activeSessionId),
        ]);
      } catch (error) {
        console.error('Failed to save sessions:', error);
      }
    }
    persist();
  }, [state.activeSessionId, state.sessions, state.isLoaded]);

  const activeSession = useMemo(() => {
    return state.sessions.find((s) => s.id === state.activeSessionId) || null;
  }, [state.activeSessionId, state.sessions]);

  const setActiveChat = useCallback((sessionId: string) => {
    setState((prev) => {
      if (prev.activeSessionId === sessionId) return prev;
      if (!prev.sessions.some((s) => s.id === sessionId)) return prev;
      return { ...prev, activeSessionId: sessionId };
    });
  }, []);

  const createNewChat = useCallback(() => {
    const session = newSession();
    setState((prev) => ({
      ...prev,
      activeSessionId: session.id,
      sessions: [session, ...prev.sessions],
    }));
    return session.id;
  }, []);

  const updateActiveChat = useCallback((patch: Partial<LifelineChatSession>) => {
    setState((prev) => {
      const nextSessions = prev.sessions.map((s) => {
        if (s.id !== prev.activeSessionId) return s;
        const updated: LifelineChatSession = {
          ...s,
          ...patch,
          updatedAt: Date.now(),
        };
        return updated;
      });
      return { ...prev, sessions: nextSessions };
    });
  }, []);

  const appendActiveMessage = useCallback(
    (message: Omit<LifelineChatMessage, 'id'>) => {
      setState((prev) => {
        const nextSessions = prev.sessions.map((s) => {
          if (s.id !== prev.activeSessionId) return s;
          return {
            ...s,
            updatedAt: Date.now(),
            messages: [...s.messages, { id: makeId(), ...message }],
          };
        });
        return { ...prev, sessions: nextSessions };
      });
    },
    [],
  );

  const resetActiveChat = useCallback(() => {
    setState((prev) => {
      const nextSessions = prev.sessions.map((s) => {
        if (s.id !== prev.activeSessionId) return s;
        return {
          ...s,
          updatedAt: Date.now(),
          ecgFlowStep: 'upload' as const,
          ecgImageDataUrl: null,
          ecgFileName: '',
          ecgDescription: '',
          messages: [],
        };
      });
      return { ...prev, sessions: nextSessions };
    });
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setState((prev) => {
      const nextSessions = prev.sessions.filter((s) => s.id !== sessionId);
      // If we deleted the active one, or if no sessions left, create a fresh one
      if (nextSessions.length === 0) {
        const fresh = newSession();
        return { activeSessionId: fresh.id, sessions: [fresh], isLoaded: true };
      }
      const nextActiveId = prev.activeSessionId === sessionId ? nextSessions[0].id : prev.activeSessionId;
      return { ...prev, sessions: nextSessions, activeSessionId: nextActiveId };
    });
  }, []);

  const renameSession = useCallback((sessionId: string, newName: string) => {
    setState((prev) => {
      const nextSessions = prev.sessions.map((s) => {
        if (s.id !== sessionId) return s;
        return { ...s, ecgFileName: newName, updatedAt: Date.now() };
      });
      return { ...prev, sessions: nextSessions };
    });
  }, []);

  const value: ChatSessionsContextValue = useMemo(
    () => ({
      activeSession,
      sessions: state.sessions,
      activeSessionId: state.activeSessionId,
      isLoaded: state.isLoaded,
      createNewChat,
      setActiveChat,
      updateActiveChat,
      appendActiveMessage,
      resetActiveChat,
      deleteSession,
      renameSession,
    }),
    [
      activeSession,
      createNewChat,
      setActiveChat,
      state.activeSessionId,
      state.sessions,
      state.isLoaded,
      updateActiveChat,
      appendActiveMessage,
      resetActiveChat,
      deleteSession,
      renameSession,
    ],
  );

  return (
    <ChatSessionsContext.Provider value={value}>
      {children}
    </ChatSessionsContext.Provider>
  );
}

export function useChatSessions() {
  const ctx = useContext(ChatSessionsContext);
  if (!ctx) {
    throw new Error('useChatSessions must be used within ChatSessionsProvider');
  }
  return ctx;
}

