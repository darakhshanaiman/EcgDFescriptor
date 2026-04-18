import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useChatSessions } from '../../lib/contexts/ChatSessionsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/contexts/ThemeContext';

const { width } = Dimensions.get('window');

type FlowStep = 'welcome' | 'confirm_image' | 'uploading' | 'preview' | 'analyzing';

export default function AnalyzeScreen() {
  const { colors } = useTheme();
  const [step, setStep] = useState<FlowStep>('welcome');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { updateActiveChat } = useChatSessions();
  const insets = useSafeAreaInsets();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setStep('confirm_image');
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setStep('confirm_image');
    }
  };

  const startUploading = () => {
    setStep('uploading');
    setProgress(0);
  };

  useEffect(() => {
    if (step === 'uploading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('preview');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleAnalyze = () => {
    setStep('analyzing');
    setProgress(0);
    
    // Simulate complex analysis
    setTimeout(() => {
      // Mock result
      updateActiveChat({
        ecgFlowStep: 'report',
        ecgImageDataUrl: selectedImage,
        ecgFileName: 'ECG_' + new Date().getTime() + '.png',
        analysisResult: {
          rhythm: 'Normal sinus rhythm',
          heartRate: 72,
          intervals: {
            pr: '160 ms',
            qrs: '90 ms',
            qtc: '410 ms'
          },
          findings: ['No ST-segment changes', 'Regular rhythm', 'Normal axis'],
          impression: 'Normal ECG. No acute ischemic changes detected.'
        }
      });
      router.push('/report');
    }, 3000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Analyze ECG</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {step === 'welcome' && (
          <View style={styles.welcomeContainer}>
            <View style={[styles.mascotContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Image 
                source={require('../../assets/images/mascot_clean.jpg')} 
                style={styles.mascotImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Upload or Capture</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Please provide a clear image of your ECG strip for AI analysis.
            </Text>

            <Pressable style={styles.primaryButton} onPress={pickImage}>
              <Feather name="image" size={20} color="#fff" />
              <Text style={styles.buttonText}>Pick from Gallery</Text>
            </Pressable>

            <Pressable style={[styles.secondaryButton, { borderColor: colors.primary }]} onPress={takePhoto}>
              <Feather name="camera" size={20} color={colors.primary} />
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Take a photo</Text>
            </Pressable>
          </View>
        )}

        {step === 'confirm_image' && selectedImage && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background, zIndex: 10 }]}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
              <Pressable onPress={() => setStep('welcome')} style={styles.backButton}>
                <Feather name="x" size={24} color={colors.text} />
              </Pressable>
              <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Check ECG</Text>
              </View>
              <Pressable onPress={startUploading} style={styles.backButton}>
                <Feather name="check" size={28} color={colors.primary} />
              </Pressable>
            </View>

            <View style={styles.confirmContent}>
              <View style={[styles.fullImageWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
              </View>
              
              <View style={styles.confirmInfo}>
                <Text style={[styles.confirmText, { color: colors.textSecondary }]}>
                  Ensure the ECG rhythm is clearly visible and readable before continuing.
                </Text>
              </View>
            </View>
          </View>
        )}

        {step === 'uploading' && (
          <View style={styles.centerFlow}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.flowText, { color: colors.text }]}>Uploading your ECG...</Text>
            <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
            </View>
          </View>
        )}

        {step === 'preview' && selectedImage && (
          <View style={styles.previewContainer}>
            <Text style={[styles.previewTitle, { color: colors.text }]}>ECG Preview</Text>
            <View style={[styles.imagePreviewWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <Pressable style={styles.removeButton} onPress={() => setStep('welcome')}>
                <Feather name="x" size={20} color="#fff" />
              </Pressable>
            </View>
            
            <Pressable style={[styles.analyzeButton, { backgroundColor: colors.primary }]} onPress={handleAnalyze}>
              <Text style={styles.buttonText}>Analyze This ECG</Text>
            </Pressable>
          </View>
        )}

        {step === 'analyzing' && (
          <View style={styles.centerFlow}>
             <View style={[styles.mascotContainerSmall, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Image 
                source={require('../../assets/images/mascot_clean.jpg')} 
                style={styles.mascotImageSmall}
                resizeMode="cover"
              />
            </View>
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
            <Text style={[styles.flowText, { color: colors.text }]}>AI is analyzing your rhythm...</Text>
            <Text style={[styles.flowSubtext, { color: colors.textSecondary }]}>This usually takes a few seconds</Text>
          </View>
        )}
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  mascotContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  centerFlow: {
    alignItems: 'center',
    marginTop: 60,
  },
  flowText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
  },
  flowSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginTop: 32,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  previewContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 32,
  },
  imagePreviewWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 48,
    borderWidth: 1,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  mascotContainerSmall: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  mascotImageSmall: {
    width: '100%',
    height: '100%',
  },
  confirmContent: {
    flex: 1,
    padding: 24,
  },
  fullImageWrapper: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  confirmInfo: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
