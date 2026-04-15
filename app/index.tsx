import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../lib/firebase";

export default function Index() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2F80ED" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});