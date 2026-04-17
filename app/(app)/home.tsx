import { View, Text, Pressable, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { router } from "expo-router";

export default function HomeScreen() {
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logged in successfully</Text>
      <Text style={styles.subtitle}>This will be your real app dashboard later.</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#2F80ED",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});