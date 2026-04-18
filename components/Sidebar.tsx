import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/contexts/AuthContext';
import { useTheme } from '../lib/contexts/ThemeContext';

const MENU_ITEMS = [
  { label: 'Homepage', icon: 'home', route: '/' },
  { label: 'Analyze ECG', icon: 'activity', route: '/analyze' },
  { label: 'Edit Profile', icon: 'user', route: '/profile' },
  { label: 'Chats', icon: 'message-square', route: '/chat' },
  { label: 'Insights', icon: 'pie-chart', route: '/insights' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
];

export function Sidebar() {
  const { logOut } = useAuth();
  const { colors } = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Feather name="heart" size={24} color={colors.primary} />
          <Text style={[styles.logoText, { color: colors.text }]}>Lifeline.ai</Text>
        </View>
      </View>

      <ScrollView style={styles.menuContainer}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.route);
          return (
            <Pressable
              key={item.label}
              onPress={() => navigateTo(item.route)}
              style={[
                styles.menuItem, 
                isActive && { backgroundColor: `${colors.primary}15` }
              ]}
            >
              <Feather
                name={item.icon as any}
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.menuText, 
                { color: colors.textSecondary },
                isActive && { color: colors.primary, fontWeight: '600' }
              ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
