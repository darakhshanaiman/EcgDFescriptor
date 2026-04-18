import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SecurityScreen() {
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>Security</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={[styles.securityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="shield" size={40} color={colors.primary} style={styles.cardIcon} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Multi-Layered Security</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            We use end-to-end encryption for all data transfers and military-grade storage for your health records.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Authentication</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          Your account is protected by industry-standard authentication protocols. We recommend using a strong, unique password and never sharing your login credentials.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Secure Processing</Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          ECG analyses are performed in an isolated secure environment to ensure that your medical patterns remain private and protected from unauthorized access.
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
  securityCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 32,
  },
  cardIcon: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
