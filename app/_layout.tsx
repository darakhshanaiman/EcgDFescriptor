import { Stack } from "expo-router";
import { AuthProvider } from "../lib/contexts/AuthContext";
import { ChatSessionsProvider } from "../lib/contexts/ChatSessionsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChatSessionsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </ChatSessionsProvider>
    </AuthProvider>
  );
}