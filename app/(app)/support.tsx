import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SupportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const faqs = [
    { q: 'How accurate is the AI?', a: 'Our AI is trained on over 500,000 clinically validated ECG strips. While highly accurate, it is intended for educational and insight purposes and is not a substitute for a professional medical diagnosis.' },
    { q: 'Can I share reports?', a: 'Yes, you can export your ECG analysis report as a PDF from the analysis results screen to share with your cardiologist.' },
    { q: 'Is my data private?', a: 'Your data is encrypted end-to-end and stored securely. We do not sell your medical information to third parties.' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Support & FAQ</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
        
        {faqs.map((faq, index) => (
          <View key={index} style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.q}</Text>
            <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.a}</Text>
          </View>
        ))}

        <Pressable 
          style={[styles.contactCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/contact')}
        >
          <Feather name="message-circle" size={24} color="#fff" />
          <View>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>Click here to contact our team</Text>
          </View>
        </Pressable>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginTop: 20,
    gap: 20,
  },
  contactTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  contactSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
