import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../lib/contexts/AuthContext";
import { ChatSessionsProvider } from "../lib/contexts/ChatSessionsContext";
import { ThemeProvider } from "../lib/contexts/ThemeContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAppGroup = segments[0] === '(app)';

    if (user && !inAppGroup) {
      // If user is logged in but NOT in the (app) group, send them to home
      // Wait a tiny bit to ensure the router is ready
      router.replace('/(app)');
    } else if (!user && inAppGroup) {
      // If user is NOT logged in and IS in the (app) group, send them to landing
      router.replace('/');
    }
  }, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChatSessionsProvider>
          <RootLayoutNav />
        </ChatSessionsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}