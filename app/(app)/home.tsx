import { View, Text, Button, StyleSheet } from "react-native";
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
      <Text style={styles.title}>You are logged in</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});