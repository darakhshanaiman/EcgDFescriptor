import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 480;

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      router.push("/check-email");
    } catch (error: any) {
      Alert.alert("Reset failed", error.message);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.phoneFrame, isSmallScreen && styles.phoneFrameMobile]}>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.title}>Forgot password?</Text>
            <View style={styles.rightSpacer} />
          </View>

          <Image
            source={require("../../assets/images/forgot-password.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            Enter your email address to reset your password.
          </Text>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9A9A9A"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          </View>

          <Pressable style={styles.primaryButton} onPress={handleResetPassword}>
            <Text style={styles.primaryButtonText}>Reset password</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  phoneFrame: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: "#000",
    borderRadius: 28,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  phoneFrameMobile: {
    maxWidth: "100%",
    paddingHorizontal: 20,
    borderRadius: 0,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  rightSpacer: {
    width: 24,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  illustration: {
    width: 180,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
  description: {
    color: "#D0D0D0",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 18,
  },
  inputBlock: {
    marginBottom: 16,
  },
  label: {
    color: "#B8B8B8",
    fontSize: 10,
    marginBottom: 5,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#008CFF",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#2F80ED",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});