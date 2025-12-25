import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  Keyboard,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../navigation/types';
import { useCommunityGroup } from '../../hooks/useCommunityGroup';
import { GroupMessage } from '../../models/CommunityGroup';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { PurpleHeader } from '../../components/common/PurpleHeader';

type GroupChatScreenRouteProp = RouteProp<MainStackParamList, 'GroupChat'>;
type GroupChatScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'GroupChat'>;

interface Props {
  route: GroupChatScreenRouteProp;
  navigation: GroupChatScreenNavigationProp;
}

const MessageBubble: React.FC<{ message: GroupMessage }> = React.memo(({ message }) => {
  const { colors } = useTheme();
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View
      style={[
        styles.messageContainer,
        message.isOwn && styles.ownMessage,
        message.isSupervisor && styles.supervisorMessage,
      ]}
    >
      {!message.isOwn && (
        <Text style={[styles.messageUser, { color: colors.text.secondary }]}>
          {message.isSupervisor ? '👨‍⚕️ ' : ''}
          {message.userDisplayName}
        </Text>
      )}
      <View
        style={[
          styles.messageBubble,
          message.isOwn && { backgroundColor: colors.purple.medium },
          message.isSupervisor && { backgroundColor: colors.purple.light, borderColor: colors.purple.medium, borderWidth: 2 },
          !message.isOwn && !message.isSupervisor && { backgroundColor: colors.background.card },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.isOwn && { color: colors.text.white },
            message.isSupervisor && { color: colors.text.primary },
            !message.isOwn && !message.isSupervisor && { color: colors.text.primary },
          ]}
        >
          {message.message}
        </Text>
        <Text
          style={[
            styles.messageTime,
            message.isOwn && { color: colors.text.white },
            message.isSupervisor && { color: colors.text.secondary },
            !message.isOwn && !message.isSupervisor && { color: colors.text.secondary },
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
});

export const GroupChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { groupId, groupName } = route.params;
  const { currentGroup, messages: hookMessages, sendMessage, selectGroupById, loading, leaveGroup } = useCommunityGroup();
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [localMessages, setLocalMessages] = useState<GroupMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const isLeavingRef = useRef(false); // Prevent re-renders after leaving
  const isMountedRef = useRef(true); // Track if component is mounted
  const messagesInitializedRef = useRef(false); // Track if messages have been initialized
  const lastHookMessageIdsRef = useRef<string>(''); // Track hook message IDs to detect real changes

  // Check if user is a member of the group
  const isMember = currentGroup && user ? currentGroup.memberIds.includes(user.id) : false;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Load group when component mounts, but skip if we're leaving
    if (!isLeavingRef.current && currentGroup?.id !== groupId) {
      selectGroupById(groupId);
    }
  }, [groupId, currentGroup?.id, selectGroupById]);

  // Initialize and sync local messages state with hook messages
  useEffect(() => {
    if (currentGroup?.id === groupId) {
      // Create a string of message IDs to detect real changes
      const hookMessageIds = hookMessages.map(m => m.id).join(',');
      const hookChanged = hookMessageIds !== lastHookMessageIdsRef.current;
      
      if (hookMessages.length > 0 && !messagesInitializedRef.current) {
        // First time loading messages for this group
        setLocalMessages(hookMessages);
        messagesInitializedRef.current = true;
        lastHookMessageIdsRef.current = hookMessageIds;
      } else if (hookMessages.length === 0) {
        // Messages cleared (e.g., when leaving group or switching groups)
        messagesInitializedRef.current = false;
        setLocalMessages([]);
        lastHookMessageIdsRef.current = '';
      } else if (messagesInitializedRef.current && hookChanged) {
        // Hook messages have been reloaded (e.g., after sending a message)
        // Merge: keep optimistic messages that aren't in hook yet, add/update hook messages
        setLocalMessages(prev => {
          const hookMessageIdsSet = new Set(hookMessages.map(m => m.id));
          
          // Find optimistic messages (in prev but not in hook - temporary messages)
          const optimisticMessages = prev.filter(m => !hookMessageIdsSet.has(m.id) && m.id.startsWith('temp-'));
          
          // Combine: hook messages (source of truth) + optimistic messages not yet confirmed
          // Sort by timestamp to maintain chronological order
          const merged = [...hookMessages, ...optimisticMessages].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          return merged;
        });
        lastHookMessageIdsRef.current = hookMessageIds;
      }
    }
  }, [hookMessages, currentGroup?.id, groupId]);

  useEffect(() => {
    if (localMessages.length > 0) {
      const timeoutId = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [localMessages.length]);

  // Track keyboard height
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
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

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || sending || !currentGroup || !isMember) return;

    const messageToSend = inputText.trim();
    setInputText('');
    setSending(true);

    // Create optimistic message immediately
    const optimisticMessage: GroupMessage = {
      id: `temp-${Date.now()}-${Math.random()}`,
      groupId: currentGroup.id,
      userId: '', // Will be updated by hook
      userDisplayName: '', // Will be updated by hook
      message: messageToSend,
      timestamp: new Date().toISOString(),
      isOwn: true,
      isSupervisor: false,
    };

    // Add optimistic message to local state immediately (immutable update)
    setLocalMessages(prev => [...prev, optimisticMessage]);

    try {
      const sentMessage = await sendMessage(currentGroup.id, messageToSend);
      
      if (sentMessage) {
        // Replace optimistic message with real message from server
        setLocalMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? sentMessage : msg
          )
        );
      } else {
        // If send failed, remove optimistic message
        setLocalMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setInputText(messageToSend);
      }

      // Scroll to end after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setLocalMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      setInputText(messageToSend);
    } finally {
      setSending(false);
    }
  }, [inputText, sending, currentGroup, sendMessage]);

  const handleLeaveGroup = useCallback(async () => {
    if (!currentGroup || leaving || isLeavingRef.current) return;

    // Set flag immediately to prevent re-renders
    isLeavingRef.current = true;
    setLeaving(true);
    
    // Close modal immediately before any async operations
    setShowLeaveModal(false);

    try {
      console.log('[GroupChat] Starting leave group process for:', currentGroup.id);
      const success = await leaveGroup(currentGroup.id);
      console.log('[GroupChat] Leave group result:', success);
      
      if (success && isMountedRef.current) {
        // Navigate immediately after closing modal, before state updates complete
        // Use setTimeout to ensure modal is fully closed
        setTimeout(() => {
          if (isMountedRef.current) {
            console.log('[GroupChat] Navigating to CommunityGroupList');
            navigation.navigate('CommunityGroupList');
          }
        }, 100);
      } else if (!success && isMountedRef.current) {
        // Reset flag if leaving failed
        isLeavingRef.current = false;
        Alert.alert('Error', 'Failed to leave group. Please try again.');
      }
    } catch (error) {
      console.error('[GroupChat] Error leaving group:', error);
      // Reset flag on error
      isLeavingRef.current = false;
      if (isMountedRef.current) {
        Alert.alert('Error', 'Failed to leave group. Please try again.');
      }
    } finally {
      if (isMountedRef.current) {
        setLeaving(false);
      }
    }
  }, [currentGroup, leaving, leaveGroup, navigation]);

  const renderMessage = useCallback(({ item }: { item: GroupMessage }) => (
    <MessageBubble message={item} />
  ), []);

  const keyExtractor = useCallback((item: GroupMessage) => item.id, []);

  const displayTitle = groupName || (currentGroup ? `${currentGroup.code} - ${currentGroup.theme}` : 'Group Chat');

  // Don't try to load group if we're leaving
  if (isLeavingRef.current) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title="Leaving group..." showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  if (loading || !currentGroup) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title={displayTitle} showBack />
        <ActivityIndicator size="large" color={colors.purple.medium} style={styles.loader} />
      </View>
    );
  }

  // Show join message if user is not a member
  if (!isMember) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.white }]}>
        <PurpleHeader title={displayTitle} showBack />
        <View style={styles.joinMessageContainer}>
          <Text style={[styles.joinMessageTitle, { color: colors.text.primary }]}>
            Rejoindre le groupe
          </Text>
          <Text style={[styles.joinMessageText, { color: colors.text.secondary }]}>
            Vous devez rejoindre ce groupe pour voir les messages et participer à la discussion.
          </Text>
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.purple.medium }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.joinButtonText, { color: colors.text.white }]}>
              Retour
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Calculate input container bottom padding
  // When keyboard is open: no extra padding (KAV handles it)
  // When keyboard is closed: use safe area insets
  const inputBottomPadding = keyboardHeight > 0 ? 0 : Math.max(insets.bottom, 8);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <PurpleHeader title={displayTitle} showBack />

      {/* Supervision Info Banner with Leave Button */}
      <View style={[styles.infoBanner, { backgroundColor: colors.purple.light, borderBottomColor: colors.background.gray }]}>
        <Text style={styles.infoIcon}>🔒</Text>
        <View style={styles.infoContent}>
          <Text style={[styles.infoTitle, { color: colors.text.primary }]}>Supervised Group</Text>
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            This group is supervised by {currentGroup.supervisorName}. Your identity is protected with an anonymized display name.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: colors.background.white }]}
          onPress={() => setShowLeaveModal(true)}
        >
          <Text style={[styles.menuIcon, { color: colors.text.primary }]}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={localMessages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onContentSizeChange={() => {
          if (keyboardHeight > 0 || localMessages.length > 0) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }}
      />

      {/* Input */}
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.background.white,
          borderTopColor: colors.background.gray,
          paddingBottom: inputBottomPadding,
        }
      ]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { backgroundColor: colors.background.lightGray, color: colors.text.primary }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.light}
          value={inputText}
          onChangeText={setInputText}
          multiline
          onFocus={() => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.purple.medium },
            (sending || !isMember) && { backgroundColor: colors.background.gray }
          ]}
          onPress={handleSend}
          disabled={sending || !inputText.trim() || !isMember}
        >
          <Text style={[styles.sendButtonText, { color: colors.text.white }]}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Leave Group Modal */}
      <Modal
        visible={showLeaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background.white }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Leave group?</Text>
            <Text style={[styles.modalBody, { color: colors.text.secondary }]}>
              You will stop seeing messages from this group. You can rejoin later.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.background.gray }]}
                onPress={() => setShowLeaveModal(false)}
                disabled={leaving}
              >
                <Text style={[styles.modalButtonText, { color: colors.text.secondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonLeave,
                  { backgroundColor: colors.status.error },
                  leaving && { opacity: 0.6 }
                ]}
                onPress={handleLeaveGroup}
                disabled={leaving}
              >
                {leaving ? (
                  <ActivityIndicator size="small" color={colors.text.white} />
                ) : (
                  <Text style={[styles.modalButtonText, { color: colors.text.white }]}>Leave</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 4,
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  supervisorMessage: {
    alignItems: 'flex-start',
  },
  messageUser: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 8,
    fontWeight: '600',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '75%',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    textAlign: 'right',
  },
  ownMessageTime: {
    opacity: 0.8,
  },
  inputContainer: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
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
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    borderWidth: 1,
  },
  modalButtonLeave: {
    // backgroundColor set inline
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  joinMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  joinMessageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  joinMessageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  joinButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

