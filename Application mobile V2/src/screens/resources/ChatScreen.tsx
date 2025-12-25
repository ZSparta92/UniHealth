import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from '../../models/Chat';
import { useTheme } from '../../context/ThemeContext';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type ChatScreenRouteProp = RouteProp<ResourcesStackParamList, 'Chat'>;
type ChatScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'Chat'>;

interface Props {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

const MessageBubble: React.FC<{ message: ChatMessage; therapistName: string }> = React.memo(({
  message,
  therapistName,
}) => {
  const { colors } = useTheme();
  const isUser = message.senderType === 'user';

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.therapistMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUser ? { backgroundColor: colors.purple.light, borderBottomRightRadius: 4 } : { backgroundColor: colors.background.lightGray, borderBottomLeftRadius: 4 },
        ]}
      >
        <Text style={[styles.messageText, { color: colors.text.primary }]}>
          {message.message}
        </Text>
        <Text style={[styles.messageTime, { color: colors.text.secondary }, isUser && { textAlign: 'right' }]}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
});

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { therapistId, therapistName } = route.params;
  const { messages, loading, sendMessage, initializeChat } = useChat(therapistId);
  const { colors } = useTheme();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    initializeChat(therapistId, therapistName);
  }, [therapistId, therapistName, initializeChat]);

  // Scroll to end when new messages arrive, but only if not typing
  useEffect(() => {
    if (messages.length > 0) {
      // Use a small delay to ensure layout is complete
      const timeoutId = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || sending) return;

    const messageToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendMessage(messageToSend);
      // Refocus input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore input text on error
      setInputText(messageToSend);
    } finally {
      setSending(false);
    }
  }, [inputText, sending, sendMessage]);

  // Memoize renderItem to prevent re-renders
  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} therapistName={therapistName} />
  ), [therapistName]);

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  // Stable contentContainerStyle
  const contentContainerStyle = useMemo(() => [
    styles.messagesContainer,
    messages.length === 0 && styles.emptyMessagesContainer,
  ], [messages.length]);

  if (loading && messages.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text.primary }]}>Loading chat...</Text>
        </View>
      </View>
    );
  }

  const listEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: colors.text.primary }]}>No messages yet</Text>
      <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>Start a conversation</Text>
    </View>
  ), [colors]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <PurpleHeader title={`Chat with ${therapistName}`} showBack />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={listEmptyComponent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        style={styles.flatList}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background.white, borderTopColor: colors.background.lightGray }]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { borderColor: colors.background.gray, backgroundColor: colors.background.lightGray }]}
          placeholder="Write a message..."
          placeholderTextColor={colors.text.light}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.purple.light },
            (!inputText.trim() || sending) && { backgroundColor: colors.background.gray, opacity: 0.6 },
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          <Text style={[styles.sendButtonText, { color: colors.text.white }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyMessagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  therapistMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    minHeight: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
