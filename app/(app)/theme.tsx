import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ThemeScreen() {
  const { colors, mode, setMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/settings')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Theme</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Pressable
          style={styles.item}
          onPress={() => setMode('light')}
        >
          <Text style={[styles.label, { color: colors.text }]}>Light</Text>
          <View style={[
            styles.radio, 
            { borderColor: mode === 'light' ? colors.primary : colors.textSecondary }
          ]}>
            {mode === 'light' && (
              <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => setMode('dark')}
        >
          <Text style={[styles.label, { color: colors.text }]}>Dark</Text>
          <View style={[
            styles.radio, 
            { borderColor: mode === 'dark' ? colors.primary : colors.textSecondary }
          ]}>
            {mode === 'dark' && (
              <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
            )}
          </View>
        </Pressable>
      </View>
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
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
