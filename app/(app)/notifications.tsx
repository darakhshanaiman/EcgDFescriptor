import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState({
    enable: true,
    sound: true,
    vibrate: true,
    led: true,
    updates: true,
    dnd: false,
    critical: true,
  });

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { id: 'enable', label: 'Enable Notifications' },
    { id: 'sound', label: 'Sound' },
    { id: 'vibrate', label: 'Vibrate' },
    { id: 'led', label: 'LED Alerts' },
    { id: 'updates', label: 'App Updates' },
    { id: 'dnd', label: 'Do Not Disturb Mode' },
    { id: 'critical', label: 'Critical Alerts Only' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/settings')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content}>
        {notificationItems.map((item) => (
          <View key={item.id} style={[styles.item, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
            <Switch
              trackColor={{ false: '#3e3e3e', true: '#27AE60' }}
              thumbColor={settings[item.id as keyof typeof settings] ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(item.id as keyof typeof settings)}
              value={settings[item.id as keyof typeof settings]}
            />
          </View>
        ))}
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
