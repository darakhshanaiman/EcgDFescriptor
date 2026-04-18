import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useChatSessions } from '../../lib/contexts/ChatSessionsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportScreen() {
  const { activeSession, updateActiveChat } = useChatSessions();
  const insets = useSafeAreaInsets();
  
  const result = activeSession?.analysisResult;

  if (!result) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No analysis data found.</Text>
        <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  const handleStartChat = () => {
    updateActiveChat({ ecgFlowStep: 'chat' });
    router.push(`/chat/${activeSession.id}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/')} style={styles.iconButton}>
          <Feather name="x" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>ECG Report</Text>
        <Pressable style={styles.iconButton}>
          <Feather name="share-2" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Hero Image Section */}
      <View style={styles.heroSection}>
        <Image source={{ uri: activeSession.ecgImageDataUrl! }} style={styles.heroImage} />
        <View style={styles.heroOverlay}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI Analysis Complete</Text>
          </View>
        </View>
      </View>

      {/* Results Content */}
      <View style={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Rhythm</Text>
              <Text style={styles.summaryValue}>{result.rhythm}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Heart Rate</Text>
              <Text style={styles.summaryValue}>{result.heartRate} BPM</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>PR Interval</Text>
              <Text style={styles.summaryValue}>{result.intervals.pr}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>QRS Duration</Text>
              <Text style={styles.summaryValue}>{result.intervals.qrs}</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>QTc Interval</Text>
              <Text style={styles.summaryValue}>{result.intervals.qtc}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Key Findings</Text>
        <View style={styles.findingsList}>
          {result.findings.map((finding, index) => (
            <View key={index} style={styles.findingItem}>
              <Feather name="check-circle" size={18} color="#27AE60" />
              <Text style={styles.findingText}>{finding}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Impression</Text>
        <View style={styles.impressionCard}>
          <Text style={styles.impressionText}>{result.impression}</Text>
        </View>

        <View style={styles.warningBox}>
          <Feather name="alert-triangle" size={20} color="#F2994A" />
          <Text style={styles.warningText}>
            This is an AI-generated summary and not a definitive medical diagnosis. Always consult with a qualified physician.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.chatButton} onPress={handleStartChat}>
            <Feather name="message-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Chat with Report</Text>
          </Pressable>

          <Pressable style={styles.tipsButton}>
            <Text style={styles.tipsButtonText}>Get More Tips</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  heroSection: {
    width: '100%',
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badge: {
    backgroundColor: '#2F80ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#121212',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    marginBottom: 32,
    marginTop: -40,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: '#828282',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1E1E',
  },
  vDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  findingsList: {
    marginBottom: 24,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  findingText: {
    color: '#E0E0E0',
    fontSize: 15,
  },
  impressionCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  impressionText: {
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(242, 153, 74, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    gap: 12,
    alignItems: 'flex-start',
  },
  warningText: {
    color: '#F2994A',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  actions: {
    gap: 16,
  },
  chatButton: {
    backgroundColor: '#2F80ED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  tipsButton: {
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tipsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EB5757',
    marginBottom: 20,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
