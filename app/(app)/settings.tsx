import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { colors, mode } = useTheme();
  const { logOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await logOut();
      // Use dismissAll or similar if needed to clear stack, but replace to root is usually enough
      // if AuthContext state updates correctly.
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/notifications', value: 'ON' },
    { id: 'language', label: 'Language', icon: 'globe', route: '/language', value: 'English' },
    { id: 'theme', label: 'Theme Mode', icon: 'moon', route: '/theme', value: mode === 'dark' ? 'Dark' : 'Light' },
    { id: 'privacy', label: 'Privacy Policy', icon: 'lock', route: '/privacy' },
    { id: 'security', label: 'Security', icon: 'shield', route: '/security' },
    { id: 'support', label: 'Support', icon: 'help-circle', route: '/support' },
    { id: 'contact', label: 'Contact us', icon: 'mail', route: '/contact' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => item.route && router.push(item.route as any)}
          >
            <View style={styles.menuItemLeft}>
              <Feather name={item.icon as any} size={20} color={colors.text} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.value && (
                <Text style={[styles.menuValue, { color: colors.primary }]}>{item.value}</Text>
              )}
              <Feather name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
          </Pressable>
        ))}

        <Pressable
          style={[styles.menuItem, { borderBottomWidth: 0, marginTop: 24 }]}
          onPress={handleLogout}
        >
          <View style={styles.menuItemLeft}>
            <View style={[styles.logoutIconBox, { backgroundColor: '#EB575715' }]}>
              <Feather name="log-out" size={20} color="#EB5757" />
            </View>
            <Text style={[styles.menuLabel, { color: '#EB5757', fontWeight: '700' }]}>Log out</Text>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
});
