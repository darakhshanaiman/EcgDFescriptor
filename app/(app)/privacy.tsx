import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.push('/settings')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Your privacy is important to us. Lifeline.ai is committed to protecting the privacy and security of your personal and medical data.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Collection</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          We collect ECG images and basic profile information to provide AI-powered medical insights. This data is processed securely and is never shared with third parties without your explicit consent.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Usage</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Your data is used solely to improve the accuracy of our AI models and provide you with personalized health tracking.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Rights</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          You have the right to access, modify, or delete your data at any time through the profile settings.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60 + 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleContainer: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
