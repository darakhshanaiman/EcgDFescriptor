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
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../lib/contexts/AuthContext";
import { router } from "expo-router";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { width, height } = useWindowDimensions();
  const { signUp, signInWithGoogle } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const isSmallScreen = width < 480;

  const handleSignup = async () => {
    setError(null);
    if (!email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signUp(email.trim(), password);
      router.replace("/(app)");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
      router.replace("/(app)");
    } catch (err: any) {
      setError(err.message);
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
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.rightSpacer} />
          </View>

          <Image
            source={require("../../assets/images/signup.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#EB5757" />
              <View style={styles.errorContent}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </View>
          )}

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

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter a password"
              placeholderTextColor="#9A9A9A"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          <View style={styles.inputBlock}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Enter a password to confirm"
              placeholderTextColor="#9A9A9A"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
          </View>

          <Pressable style={styles.primaryButton} onPress={handleSignup}>
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.linkText}>Log In</Text>
            </Pressable>
          </View>

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.socialButton} onPress={handleGoogleLogin}>
            <AntDesign name="google" size={18} color="#fff" />
            <Text style={styles.socialButtonText}>Login with Google</Text>
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
    width: 190,
    height: 140,
    alignSelf: "center",
    marginBottom: 22,
  },
  errorBanner: {
    backgroundColor: "rgba(235, 87, 87, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(235, 87, 87, 0.3)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 10,
  },
  errorContent: {
    flex: 1,
  },
  errorText: {
    color: "#EB5757",
    fontSize: 13,
    lineHeight: 18,
  },
  inputBlock: {
    marginBottom: 10,
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
    marginBottom: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
  },
  switchText: {
    color: "#D0D0D0",
    fontSize: 12,
  },
  linkText: {
    color: "#2ECC71",
    fontSize: 12,
    fontWeight: "600",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#6A6A6A",
  },
  orText: {
    color: "#E0E0E0",
    fontSize: 12,
    marginHorizontal: 12,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#A0A0A0",
    borderRadius: 10,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 15,
  },
});