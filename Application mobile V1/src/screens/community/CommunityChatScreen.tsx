import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { BackButton } from '../../components/common/BackButton';
import { useCommunityChat } from '../../hooks/useCommunityChat';

type CommunityChatScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'CommunityChat'>;

interface Props {
  navigation: CommunityChatScreenNavigationProp;
}

export const CommunityChatScreen: React.FC<Props> = ({ navigation }) => {
  const { messages, loading, sendMessage } = useCommunityChat();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    const messageToSend = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: typeof messages[0] }) => (
    <View style={[styles.messageContainer, item.isOwn && styles.ownMessage]}>
      {!item.isOwn && <Text style={styles.messageUser}>{item.username}</Text>}
      <View style={[styles.messageBubble, item.isOwn && styles.ownMessageBubble]}>
        <Text style={[styles.messageText, item.isOwn && styles.ownMessageText]}>{item.message}</Text>
        <Text style={[styles.messageTime, item.isOwn && styles.ownMessageTime]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.brandTitle}>UniHealth</Text>
        <Text style={styles.brandSubtitle}>Because your mental well-being matters.</Text>
        <Text style={styles.screenTitle}>Community Chat</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.light}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  header: {
    backgroundColor: colors.purple.light,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize:  9,
    color: colors.purple.darker,
    textAlign: 'center',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  messageUser: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
    marginLeft: 8,
  },
  messageBubble: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 12,
    maxWidth: '75%',
  },
  ownMessageBubble: {
    backgroundColor: colors.purple.medium,
  },
  messageText: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  ownMessageText: {
    color: colors.text.white,
  },
  messageTime: {
    fontSize: 10,
    color: colors.text.light,
    textAlign: 'right',
  },
  ownMessageTime: {
    color: colors.text.white,
    opacity: 0.8,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.white,
    padding: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.background.gray,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.background.gray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    color: colors.text.primary,
  },
  sendButton: {
    backgroundColor: colors.purple.medium,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.secondary,
  },
});
