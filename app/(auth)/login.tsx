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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 480;

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { minHeight: height },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.phoneFrame, isSmallScreen && styles.phoneFrameMobile]}>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.title}>Log In</Text>
            <View style={styles.rightSpacer} />
          </View>

          <Image
            source={require("../../assets/images/login-image.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

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

          <Pressable onPress={() => router.push("/forgot-password")}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.push("/signup")}>
              <Text style={styles.linkText}>Sign Up</Text>
            </Pressable>
          </View>

          <View style={styles.orRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.socialButton}>
            <AntDesign name="google" size={18} color="#fff" />
            <Text style={styles.socialButtonText}>Login with Google</Text>
          </Pressable>

          <Pressable style={styles.socialButton}>
            <FontAwesome name="facebook" size={18} color="#1DA1F2" />
            <Text style={styles.socialButtonText}>Login with Facebook</Text>
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
    marginBottom: 20,
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
  forgotText: {
    color: "#D0D0D0",
    fontSize: 12,
    textAlign: "right",
    marginTop: 2,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: "#2F80ED",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
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