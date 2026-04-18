import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useChatSessions } from '../../lib/contexts/ChatSessionsContext';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { sessions, createNewChat, deleteSession, renameSession } = useChatSessions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Custom UI State
  const [menuVisible, setMenuVisible] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [newName, setNewName] = useState('');

  // Filtering: Only show sessions that have CONTENT (Analysis or Chat)
  const displaySessions = sessions.filter(s => !!s.analysisResult || s.messages.length > 0);

  const handleLongPressSession = (session: any) => {
    setSelectedSession(session);
    setMenuVisible(true);
  };

  const openRename = () => {
    setMenuVisible(false);
    setNewName(selectedSession?.ecgFileName || '');
    setRenameVisible(true);
  };

  const handleSaveRename = () => {
    if (selectedSession && newName.trim()) {
      renameSession(selectedSession.id, newName.trim());
      setRenameVisible(false);
    }
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this analysis permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSession(selectedSession.id) }
      ]
    );
  };

  const handleStartAnalysis = () => {
    createNewChat();
    router.push('/analyze');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Heart Hero';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]} 
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 40 }}
      >
        {/* Header / Greeting */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => navigation.openDrawer()} style={styles.menuIconButton}>
              <Feather name="menu" size={24} color={colors.text} />
            </Pressable>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: colors.textSecondary }]}>Good Evening,</Text>
              <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
            </View>
          </View>
          <Pressable style={[styles.profileButton, { backgroundColor: colors.surface }]} onPress={() => router.push('/profile')}>
            <Feather name="user" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Main Action Card */}
        <Pressable style={[styles.actionCard, { backgroundColor: colors.primary }]} onPress={handleStartAnalysis}>
          <View style={styles.actionCardContent}>
            <Text style={styles.cardTitle}>New ECG Analysis</Text>
            <Text style={styles.cardSubtitle}>
              Get instant medical insights from your ECG image using AI.
            </Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Start Now</Text>
              <Feather name="arrow-right" size={16} color="#fff" />
            </View>
          </View>
          <View style={styles.cardIconBG}>
            <Feather name="plus" size={32} color="rgba(255, 255, 255, 0.4)" />
          </View>
        </Pressable>

        {/* Stats Section */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {displaySessions.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Analyses</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: colors.text }]}>Healthy</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Recent State</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Insights</Text>
        </View>

        {displaySessions.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="activity" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No analysis history yet</Text>
          </View>
        ) : (
          displaySessions.slice(0, 3).map((session) => (
            <Pressable 
              key={session.id} 
              style={[styles.historyItem, { backgroundColor: colors.card }]}
              onPress={() => {
                router.push(`/chat/${session.id}`);
              }}
              onLongPress={() => handleLongPressSession(session)}
              delayLongPress={500}
            >
              <View style={[styles.historyIcon, { backgroundColor: colors.surface }]}>
                <Feather name="file-text" size={20} color={colors.primary} />
              </View>
              <View style={styles.historyContent}>
                <Text style={[styles.historyTitle, { color: colors.text }]} numberOfLines={1}>
                  {session.ecgFileName || 'Analysis Session'}
                </Text>
                <Text style={[styles.historyDate, { color: colors.textSecondary }]}>
                  {new Date(session.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Premium Action Sheet Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.actionSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.actionSheetHeader}>
              <View style={[styles.actionSheetIndicator, { backgroundColor: colors.border }]} />
              <Text style={[styles.actionSheetTitle, { color: colors.text }]}>Manage Session</Text>
            </View>
            
            <Pressable style={styles.actionItem} onPress={openRename}>
              <Feather name="edit-2" size={20} color={colors.text} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Rename Session</Text>
            </Pressable>
            
            <Pressable style={styles.actionItem} onPress={handleDelete}>
              <Feather name="trash-2" size={20} color="#EB5757" />
              <Text style={[styles.actionLabel, { color: '#EB5757' }]}>Delete Session</Text>
            </Pressable>

            <Pressable style={[styles.actionItem, { marginTop: 10 }]} onPress={() => setMenuVisible(false)}>
              <Text style={[styles.cancelLabel, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Premium Rename Modal */}
      <Modal
        visible={renameVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.renameDialog, { backgroundColor: colors.surface }]}>
            <Text style={[styles.renameTitle, { color: colors.text }]}>Rename Session</Text>
            <TextInput
              style={[styles.renameInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              value={newName}
              onChangeText={setNewName}
              placeholder="Analysis name"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
            <View style={styles.renameButtons}>
              <Pressable style={[styles.renameBtnSecondary, { backgroundColor: colors.background }]} onPress={() => setRenameVisible(false)}>
                <Text style={[styles.renameBtnTextSecondary, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.renameBtnPrimary, { backgroundColor: colors.primary }]} onPress={handleSaveRename}>
                <Text style={styles.renameBtnTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    height: 60 + 40, // Increased height for proper vertical alignment
  },
  greetingText: {
    color: '#828282',
    fontSize: 16,
    fontWeight: '400',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Reduced gap to bring text closer to the menu button
  },
  greetingContainer: {
    marginTop: 12, // Shifted down as requested
  },
  menuIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCard: {
    backgroundColor: '#2F80ED',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 32,
  },
  actionCardContent: {
    flex: 1,
    zIndex: 2,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    paddingRight: 40,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  cardBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cardIconBG: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#1E1E1E',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: '#828282',
    fontSize: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#2F80ED',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#121212',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  emptyStateText: {
    color: '#4F4F4F',
    fontSize: 14,
    marginTop: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    color: '#828282',
    fontSize: 12,
    marginTop: 4,
  },
  // Premium UI Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  actionSheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  actionSheetHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionSheetIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 16,
  },
  actionSheetTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelLabel: {
    color: '#828282',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
  },
  renameDialog: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    marginBottom: 'auto',
    marginTop: 'auto',
  },
  renameTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  renameInput: {
    backgroundColor: '#121212',
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  renameButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  renameBtnSecondary: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#121212',
  },
  renameBtnPrimary: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#2F80ED',
  },
  renameBtnTextSecondary: {
    color: '#828282',
    fontWeight: '600',
  },
  renameBtnTextPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
});