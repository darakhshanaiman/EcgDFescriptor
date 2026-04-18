import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useChatSessions } from '../../../lib/contexts/ChatSessionsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chatEcgWithContext, ChatEcgHistoryMessage } from '../../../lib/services/ecgAnalysisApi';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { activeSession, appendActiveMessage, setActiveChat } = useChatSessions();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (id && typeof id === 'string') {
      setActiveChat(id);
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (activeSession?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeSession?.messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    appendActiveMessage({ role: 'user', content: userMessage });

    setIsTyping(true);

    try {
      // Prepare the description from analysis result
      const description = activeSession?.analysisResult
        ? `ECG Analysis Results:\nRhythm: ${activeSession.analysisResult.rhythm}\nHeart Rate: ${activeSession.analysisResult.heartRate} BPM\nFindings: ${activeSession.analysisResult.findings.join(', ')}\nImpression: ${activeSession.analysisResult.impression}`
        : 'ECG analysis completed.';

      // Convert messages to the API format
      const previousMessages: ChatEcgHistoryMessage[] = activeSession?.messages
        .filter(msg => msg.role === 'user' || msg.role === 'ai')
        .map(msg => ({
          role: msg.role === 'ai' ? 'ai' : 'user',
          content: msg.content
        })) || [];

      // Call the API
      const result = await chatEcgWithContext(description, userMessage, previousMessages);

      setIsTyping(false);
      appendActiveMessage({
        role: 'ai',
        content: result.answer,
      });
    } catch (error) {
      console.error('Chat API failed:', error);
      setIsTyping(false);
      // Fallback to mock response
      appendActiveMessage({
        role: 'ai',
        content: getAIResponse(userMessage),
      });
    }
  };

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('die') || q.includes('dead')) {
      return "I understand your concern, but your ECG analysis specifically shows a 'Normal sinus rhythm' with regular P-QRS-T segments. There are no signs of immediate danger or acute ischemia in this reading. However, if you feel any chest pain, please call emergency services immediately.";
    }
    if (q.includes('what') && q.includes('mean')) {
      return "Based on the report, 'Normal sinus rhythm' means your heart's electrical system is working correctly and the rhythm is coming from the natural pacemaker (the sinus node). Your heart rate of 72 BPM is within the ideal resting range (60-100 BPM).";
    }
    return "Your ECG looks stable according to this analysis. The intervals (PR, QRS, QTc) are all within normal limits. Is there a specific part of the findings you'd like me to explain further?";
  };

  const renderMarkdownText = (
    text: string,
    style: any,
    boldStyle: any,
  ): React.ReactNode[] => {
    const segments: React.ReactNode[] = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push(
          <Text key={`text-${index++}`} style={style}>
            {text.slice(lastIndex, match.index)}
          </Text>,
        );
      }

      segments.push(
        <Text key={`bold-${index++}`} style={[style, boldStyle]}>
          {match[1]}
        </Text>,
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push(
        <Text key={`text-${index++}`} style={style}>
          {text.slice(lastIndex)}
        </Text>,
      );
    }

    return segments;
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isAI = item.role === 'ai';
    return (
      <View style={[styles.messageWrapper, isAI ? styles.aiWrapper : styles.userWrapper]}>
        {isAI && (
          <View style={styles.aiAvatar}>
            <Image source={require('../../../assets/images/mascot.png')} style={styles.avatarImage} />
          </View>
        )}
        <View style={[styles.messageBubble, isAI ? styles.aiBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {renderMarkdownText(item.content, [styles.messageText, isAI ? styles.aiText : styles.userText], {
              fontWeight: '700',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Chat with Report</Text>
          <Text style={styles.headerSubtitle}>Powered by Lifeline AI</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={activeSession?.messages || []}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.mascotBox}>
              <Image source={require('../../../assets/images/mascot.png')} style={styles.mascotSmall} />
            </View>
            <Text style={styles.emptyTitle}>Hello! I'm your Heart Assistant.</Text>
            <Text style={styles.emptySubtitle}>
              You can ask me anything about your ECG report or heart health in general.
            </Text>
          </View>
        }
        ListFooterComponent={
          isTyping ? (
            <View style={[styles.messageWrapper, styles.aiWrapper]}>
              <View style={styles.aiAvatar}>
                 <Image source={require('../../../assets/images/mascot.png')} style={styles.avatarImage} />
              </View>
              <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityDots />
              </View>
            </View>
          ) : null
        }
      />

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here..."
            placeholderTextColor="#4F4F4F"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function ActivityDots() {
  return (
    <View style={styles.dotsContainer}>
      <View style={styles.dot} />
      <View style={[styles.dot, { opacity: 0.6 }]} />
      <View style={[styles.dot, { opacity: 0.3 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#27AE60',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    maxWidth: '85%',
  },
  aiWrapper: {
    alignSelf: 'flex-start',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 4,
  },
  avatarImage: {
    width: 24,
    height: 24,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#2F80ED',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: '#E0E0E0',
  },
  userText: {
    color: '#fff',
  },
  typingBubble: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2F80ED',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    backgroundColor: '#000',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#121212',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  mascotBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  mascotSmall: {
    width: 60,
    height: 60,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    color: '#828282',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
