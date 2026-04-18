import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleEmail = () => {
    Linking.openURL('mailto:aiman5dara10@gmail.com');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.push('/settings')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Contact Us</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
            <Feather name="mail" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.contactName, { color: colors.text }]}>Aiman Darakhshan</Text>
          <Text style={[styles.contactRole, { color: colors.textSecondary }]}>Support & Development</Text>
          
          <Pressable style={[styles.emailBtn, { backgroundColor: colors.primary }]} onPress={handleEmail}>
            <Text style={styles.emailText}>aiman5dara10@gmail.com</Text>
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Need Help?</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            If you have any questions regarding your ECG analysis, technical issues, or suggestions for improvement, please feel free to reach out. We typically respond within 24-48 hours.
          </Text>
        </View>
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
  contactCard: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  contactRole: {
    fontSize: 14,
    marginBottom: 24,
  },
  emailBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emailText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoSection: {
    paddingHorizontal: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
