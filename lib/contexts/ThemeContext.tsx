import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  card: string;
};

const DarkTheme: ThemeColors = {
  background: '#000000',
  surface: '#121212',
  text: '#FFFFFF',
  textSecondary: '#828282',
  primary: '#2F80ED',
  border: '#1E1E1E',
  card: '#121212',
};

const LightTheme: ThemeColors = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  primary: '#2F80ED',
  border: '#E5E5E7',
  card: '#FFFFFF',
};

type ThemeContextType = {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'lifeline_theme_mode';

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    async function loadTheme() {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        setModeState(stored);
      } else if (systemScheme) {
        setModeState(systemScheme);
      }
    }
    loadTheme();
  }, [systemScheme]);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
