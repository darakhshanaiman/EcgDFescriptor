import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CheckEmailScreen() {
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 480;

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.phoneFrame, isSmallScreen && styles.phoneFrameMobile]}>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.title}>Check your email</Text>
            <View style={styles.rightSpacer} />
          </View>

          <Image
            source={require("../../assets/images/check-email.png")}
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            We have sent password recovery instructions to your email.
          </Text>

          <Pressable style={styles.primaryButton} onPress={() => router.push("/login")}>
            <Text style={styles.primaryButtonText}>Back to login</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/forgot-password")}>
            <Text style={styles.linkText}>Didn&apos;t get the email? Try again</Text>
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
    height: 150,
    alignSelf: "center",
    marginBottom: 22,
  },
  description: {
    color: "#D0D0D0",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 22,
  },
  primaryButton: {
    backgroundColor: "#2F80ED",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  linkText: {
    color: "#2ECC71",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
});