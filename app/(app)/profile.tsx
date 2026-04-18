import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image, Modal, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COUNTRIES = [
  'Pakistan', 'United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Germany', 
  'France', 'United Arab Emirates', 'Saudi Arabia', 'China', 'Japan', 'Brazil', 'Mexico'
].sort();

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, updateUserProfile } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Select Country');
  const [profession, setProfession] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState<string | null>(user?.photoURL || null);

  // Sync with user data if it loads late
  useEffect(() => {
    if (user) {
      if (!name) setName(user.displayName || '');
      if (!email) setEmail(user.email || '');
      if (!avatar) setAvatar(user.photoURL || null);
    }
  }, [user]);

  // States for Modals
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  // Confirmation Modal for Images
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredCountries = COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handlePickImage = async (useCamera: boolean) => {
    setShowActionMenu(false);
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: false, // Disable native crop to use custom confirm UI
      aspect: [1, 1],
      quality: 1,
    };

    let result;
    try {
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled) {
        setTempImage(result.assets[0].uri);
        setShowConfirmModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const confirmImage = () => {
    if (tempImage) {
      setAvatar(tempImage);
      setShowConfirmModal(false);
      setTempImage(null);
    }
  };

  const removeAvatar = () => {
    setShowActionMenu(false);
    setAvatar(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateUserProfile({
        displayName: name,
        photoURL: avatar || undefined
      });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable onPress={() => setShowActionMenu(true)} style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="user" size={50} color={colors.textSecondary} />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
              <Feather name="camera" size={16} color="#fff" />
            </View>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. johndoe123"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
            <View style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, justifyContent: 'center', opacity: 0.8 }]}>
              <Text style={{ color: colors.text, fontSize: 16 }}>{email}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+92 300 1234567"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Country</Text>
              <Pressable 
                style={[styles.input, styles.pickerButton, { borderColor: colors.border, backgroundColor: colors.card }]}
                onPress={() => setShowCountryPicker(true)}
              >
                <Text style={{ color: country === 'Select Country' ? colors.textSecondary : colors.text }}>{country}</Text>
                <Feather name="chevron-down" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Profession</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
                value={profession}
                onChangeText={setProfession}
                placeholder="e.g. Healthcare Professional"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Home Address</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your permanent address"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <Pressable 
            style={[styles.saveButton, { backgroundColor: colors.primary, opacity: isSaving ? 0.7 : 1 }]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Profile Photo Actions */}
      <Modal
        visible={showActionMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActionMenu(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowActionMenu(false)}>
          <View style={[styles.actionSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.actionSheetHeader}>
              <View style={[styles.actionSheetIndicator, { backgroundColor: colors.border }]} />
              <Text style={[styles.actionSheetTitle, { color: colors.text }]}>Profile Photo</Text>
            </View>
            
            <Pressable style={styles.actionItem} onPress={() => handlePickImage(false)}>
              <Feather name="image" size={20} color={colors.text} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Open Gallery</Text>
            </Pressable>
            
            <Pressable style={styles.actionItem} onPress={() => handlePickImage(true)}>
              <Feather name="camera" size={20} color={colors.text} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Open Camera</Text>
            </Pressable>

            {avatar && (
              <Pressable style={styles.actionItem} onPress={removeAvatar}>
                <Feather name="trash-2" size={20} color="#EB5757" />
                <Text style={[styles.actionLabel, { color: '#EB5757' }]}>Remove Photo</Text>
              </Pressable>
            )}

            <Pressable style={[styles.actionItem, { marginTop: 10 }]} onPress={() => setShowActionMenu(false)}>
              <Text style={[styles.actionLabel, { color: colors.textSecondary, fontWeight: '700', textAlign: 'center', width: '100%' }]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Image Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent={false} animationType="slide">
        <View style={[styles.confirmOverlay, { backgroundColor: colors.background }]}>
          <View style={[styles.confirmHeader, { paddingTop: insets.top }]}>
            <Pressable onPress={() => setShowConfirmModal(false)} style={styles.headerBtn}>
              <Feather name="x" size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Check Photo</Text>
            <Pressable onPress={confirmImage} style={styles.headerBtn}>
              <Feather name="check" size={28} color={colors.primary} />
            </Pressable>
          </View>
          
          <View style={styles.confirmMain}>
            <Image source={{ uri: tempImage || undefined }} style={styles.fullPreview} resizeMode="contain" />
          </View>

          <View style={[styles.confirmFooter, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={[styles.confirmHint, { color: colors.textSecondary }]}>
              Is this photo okay? Tap the tick to confirm.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Country Picker Modal */}
      <Modal visible={showCountryPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerModal, { backgroundColor: colors.surface }]}>
            <View style={styles.pickerHeader}>
              <Text style={[styles.pickerTitle, { color: colors.text }]}>Select Country</Text>
              <Pressable onPress={() => setShowCountryPicker(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </Pressable>
            </View>
            <View style={[styles.searchBar, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Feather name="search" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search..."
                placeholderTextColor={colors.textSecondary}
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
            </View>
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable 
                  style={[styles.countryOption, { borderBottomColor: colors.border }]}
                  onPress={() => { setCountry(item); setShowCountryPicker(false); }}
                >
                  <Text style={[styles.countryLabel, { color: colors.text }]}>{item}</Text>
                  {country === item && <Feather name="check" size={20} color={colors.primary} />}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
    marginTop: 8,
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
  scrollContent: {
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#27AE60',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  // Premium UI Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  actionSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionSheetIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 16,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerModal: {
    width: '90%',
    maxHeight: '80%',
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
    borderRadius: 24,
    padding: 24,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  countryLabel: {
    fontSize: 16,
  },
  // Confirmation Styles
  confirmOverlay: {
    flex: 1,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60 + 40,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  confirmFooter: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  confirmHint: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
