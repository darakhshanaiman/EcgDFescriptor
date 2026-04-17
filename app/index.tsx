import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ImageBackground,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function LandingScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (isMobile) {
    return (
      <View style={styles.mobilePage}>
        <View style={styles.mobileFrame}>
          <Text style={styles.mobileWelcome}>Welcome Back</Text>

          <Text style={styles.mobileBrand}>Lifeline.ai</Text>

          <Image
            source={require("../assets/images/welcom.png")}
            style={styles.mobileImage}
            resizeMode="contain"
          />

          <Text style={styles.mobileSubtitle}>
            Your AI Companion for Analyzing ECGs
          </Text>

          <Pressable
            style={styles.getStartedButton}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </Pressable>

          <Pressable
            style={styles.loginOutlineButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginOutlineText}>Log In</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <DesktopLanding />;
}

function DesktopLanding() {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.webPage}>
      <View style={styles.webLeft}>
        <ImageBackground
          source={require("../assets/images/home-web-bg.png")}
          style={styles.webBg}
          resizeMode="cover"
        >
          <View style={styles.webOverlay}>
            <View style={styles.webTopLogo}>
              <Image
                source={require("../assets/images/welcom.png")}
                style={styles.webTopLogoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.webCenterBlock}>
              <Text style={styles.webBrand}>Lifeline.ai</Text>
              <Text style={styles.webSubtitle}>
                Your AI assistant in diagnosing ECGs
              </Text>

              <Pressable
                style={styles.webPrimaryButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.webPrimaryButtonText}>Log in or sign up</Text>
              </Pressable>

              <Pressable
                style={styles.webPrimaryButton}
                onPress={() => router.push("/signup")}
              >
                <Text style={styles.webPrimaryButtonText}>Complete signup</Text>
              </Pressable>

              <Pressable
                style={styles.webSmallButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.webPrimaryButtonText}>Enter</Text>
              </Pressable>
            </View>

            <View style={styles.webFooter}>
              <Text style={styles.webFooterText}>© 2025 Lifeline.ai Pvt. Ltd</Text>
              <Text style={styles.webFooterText}>Terms</Text>
              <Text style={styles.webFooterText}>Help & support</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.webRight}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.webBackButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        <View style={styles.webRightInner}>
          <Text style={styles.webPanelTitle}>
            Enter your email and we&apos;ll{"\n"}send you a login link.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.webInput}
          />

          <Pressable style={styles.webSendButton} onPress={() => router.push("/login")}>
            <Text style={styles.webSendButtonText}>Send login link</Text>
          </Pressable>

          <Text style={styles.webTermsText}>
            Proceeding means you&apos;re ok with our
          </Text>
          <Text style={styles.webTermsLink}>terms & conditions</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobilePage: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  mobileFrame: {
    width: "100%",
    maxWidth: 390,
    alignItems: "center",
    paddingVertical: 40,
  },
  mobileWelcome: {
    color: "#9E9E9E",
    fontSize: 18,
    marginBottom: 48,
  },
  mobileBrand: {
    color: "#fff",
    fontSize: 34,
    marginBottom: 28,
    fontWeight: "500",
  },
  mobileImage: {
    width: 220,
    height: 220,
    marginBottom: 54,
  },
  mobileSubtitle: {
    color: "#E5E5E5",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 26,
  },
  getStartedButton: {
    backgroundColor: "#56C856",
    width: "100%",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  loginOutlineButton: {
    width: "100%",
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#0B5FFF",
  },
  loginOutlineText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  webPage: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "row",
  },
  webLeft: {
    flex: 1.1,
    backgroundColor: "#050816",
  },
  webBg: {
    flex: 1,
  },
  webOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 28,
  },
  webTopLogo: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  webTopLogoImage: {
    width: 180,
    height: 180,
  },
  webCenterBlock: {
    alignItems: "center",
    marginBottom: 80,
  },
  webBrand: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  webSubtitle: {
    color: "#F0F0F0",
    fontSize: 16,
    marginBottom: 40,
  },
  webPrimaryButton: {
    backgroundColor: "#B388FF",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 26,
    minWidth: 170,
    alignItems: "center",
    marginBottom: 14,
  },
  webSmallButton: {
    backgroundColor: "#B388FF",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
    minWidth: 90,
    alignItems: "center",
    marginTop: 2,
  },
  webPrimaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  webFooter: {
    position: "absolute",
    bottom: 14,
    flexDirection: "row",
    gap: 16,
  },
  webFooterText: {
    color: "#D9D9D9",
    fontSize: 11,
  },

  webRight: {
    width: 460,
    backgroundColor: "#141414",
    justifyContent: "center",
    paddingHorizontal: 38,
    position: "relative",
  },
  webBackButton: {
    position: "absolute",
    top: 28,
    left: 28,
    zIndex: 2,
  },
  webRightInner: {
    alignItems: "center",
  },
  webPanelTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 26,
  },
  webInput: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#2A2A2A",
    borderRadius: 14,
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  webSendButton: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#B388FF",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 22,
  },
  webSendButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  webTermsText: {
    color: "#D0D0D0",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 6,
  },
  webTermsLink: {
    color: "#B388FF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});