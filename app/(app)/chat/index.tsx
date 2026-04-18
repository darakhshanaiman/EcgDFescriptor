import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useChatSessions } from '../../../lib/contexts/ChatSessionsContext';
import { useTheme } from '../../../lib/contexts/ThemeContext';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function ChatHistoryScreen() {
  const { sessions, deleteSession } = useChatSessions();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Only show active content
  const displaySessions = sessions.filter(s => !!s.analysisResult || s.messages.length > 0);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable 
      style={[styles.sessionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
        <Feather name="message-square" size={20} color={colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {item.ecgFileName || 'Analysis Session'}
        </Text>
        <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
          {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => navigation.openDrawer()} style={styles.menuIconButton}>
            <Feather name="menu" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Chats</Text>
          </View>
        </View>
      </View>

      {displaySessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="message-circle" size={60} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No chart history yet</Text>
        </View>
      ) : (
        <FlatList
          data={displaySessions}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    height: 60 + 40,
    flexDirection: 'row',
    alignItems: 'center',
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
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  menuValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
