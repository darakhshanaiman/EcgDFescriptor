import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatSessions } from '../../lib/contexts/ChatSessionsContext';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function InsightsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { sessions } = useChatSessions();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const completedAnalyses = sessions.filter(s => !!s.analysisResult).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuIconButton}>
            <Feather name="menu" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Medical Insights</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.summaryLabel}>Total Analyses</Text>
          <Text style={styles.summaryValue}>{completedAnalyses}</Text>
          <Feather name="activity" size={40} color="rgba(255,255,255,0.3)" style={styles.summaryIcon} />
        </View>

        <View style={styles.grid}>
          <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.gridIcon, { backgroundColor: 'rgba(39, 174, 96, 0.1)' }]}>
              <Feather name="heart" size={20} color="#27AE60" />
            </View>
            <Text style={[styles.gridValue, { color: colors.text }]}>Normal</Text>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Average Rhythm</Text>
          </View>

          <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.gridIcon, { backgroundColor: 'rgba(47, 128, 237, 0.1)' }]}>
              <Feather name="clock" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.gridValue, { color: colors.text }]}>Weekly</Text>
            <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Checkup Frequency</Text>
          </View>
        </View>

        <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.insightTitle, { color: colors.text }]}>AI Recommendations</Text>
          <Text style={[styles.insightBody, { color: colors.textSecondary }]}>
            Based on your last {completedAnalyses} analyses, your heart rhythm shows consistent stability. We recommend continuing your current checkup routine and maintaining a balanced diet.
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
    height: 60 + 40, // Height plus space for alignment
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleContainer: {
    marginTop: 8, // Shift name/title down slightly
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  menuIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    marginTop: 8,
  },
  summaryIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  gridCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  gridIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  gridLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  insightCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  insightBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});
