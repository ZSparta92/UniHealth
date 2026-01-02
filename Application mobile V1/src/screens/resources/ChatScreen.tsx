import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ResourcesStackParamList } from '../../navigation/types';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from '../../models/Chat';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';

type ChatScreenRouteProp = RouteProp<ResourcesStackParamList, 'Chat'>;
type ChatScreenNavigationProp = NativeStackNavigationProp<ResourcesStackParamList, 'Chat'>;

interface Props {
  route: ChatScreenRouteProp;
  navigation: ChatScreenNavigationProp;
}

const MessageBubble: React.FC<{ message: ChatMessage; therapistName: string }> = ({
  message,
  therapistName,
}) => {
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
          isUser ? styles.userBubble : styles.therapistBubble,
        ]}
      >
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.therapistMessageText]}>
          {message.message}
        </Text>
        <Text style={[styles.messageTime, isUser ? styles.userMessageTime : styles.therapistMessageTime]}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { therapistId, therapistName } = route.params;
  const { messages, loading, sendMessage, initializeChat, refreshMessages } = useChat(therapistId);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat(therapistId, therapistName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapistId, therapistName]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMessages();
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapistId]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const messageToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendMessage(messageToSend);
      setTimeout(() => {
        refreshMessages();
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading chat...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <TouchableOpacity style={styles.profileIcon}>
          <Text style={styles.profileIconText}>👤</Text>
        </TouchableOpacity>

        {/* Therapist Profile in Header */}
        <View style={styles.therapistProfile}>
          <View style={styles.therapistAvatar}>
            <Text style={styles.avatarText}>
              {therapistName.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.therapistInfo}>
            <Text style={styles.therapistName}>{therapistName}</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.keyboardAvoidingView}>
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble message={item} therapistName={therapistName} />
          )}
          contentContainerStyle={[
            styles.messagesContainer,
            messages.length === 0 && styles.emptyMessagesContainer,
            { paddingBottom: keyboardHeight + 100 },
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start a conversation</Text>
            </View>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          style={styles.flatList}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { bottom: keyboardHeight }]}>
          <TextInput
            style={styles.input}
            placeholder="Write a message..."
            placeholderTextColor={colors.text.light}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.purple.light,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    paddingBottom: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  profileIcon: {
    position: 'absolute',
    top: 12,
    right: 20,
  },
  profileIconText: {
    fontSize: 18,
    color: colors.text.white,
  },
  therapistProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  therapistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.white,
    marginRight: 12,
  },
  avatarText: {
    color: colors.text.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 2,
  },
  onlineStatus: {
    fontSize: 14,
    color: colors.text.white,
    opacity: 0.9,
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
  userBubble: {
    backgroundColor: colors.purple.light,
    borderBottomRightRadius: 4,
  },
  therapistBubble: {
    backgroundColor: colors.background.lightGray,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: colors.text.primary,
  },
  therapistMessageText: {
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: 12,
  },
  userMessageTime: {
    color: colors.text.secondary,
    textAlign: 'right',
  },
  therapistMessageTime: {
    color: colors.text.secondary,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingTop: 16,
    backgroundColor: colors.background.white,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.background.lightGray,
    minHeight: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.background.gray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 8,
    fontSize: 16,
    backgroundColor: colors.background.lightGray,
  },
  sendButton: {
    backgroundColor: colors.purple.light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.gray,
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.text.white,
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
    color: colors.text.primary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
