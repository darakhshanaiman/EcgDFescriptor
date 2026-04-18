import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LanguageScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('English (UK)');

  const languages = [
    { section: 'Suggested', items: ['English (US)', 'English (UK)'] },
    { section: 'Others', items: ['Nepali', 'Hindi', 'Urdu', 'Spanish', 'Italian', 'Korean', 'Arabian', 'Thai'] },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content}>
        {languages.map((group) => (
          <View key={group.section} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{group.section}</Text>
            {group.items.map((lang) => (
              <Pressable
                key={lang}
                style={styles.item}
                onPress={() => setSelected(lang)}
              >
                <Text style={[styles.label, { color: colors.text }]}>{lang}</Text>
                <View style={[
                  styles.radio, 
                  { borderColor: selected === lang ? colors.primary : colors.textSecondary }
                ]}>
                  {selected === lang && (
                    <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </Pressable>
            ))}
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
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
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
