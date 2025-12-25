import { useState, useEffect, useCallback } from 'react';
import { CommunityMessage } from '../models/CommunityChat';
import { CommunityChatStorage } from '../storage/communityChatStorage';
import { useAuth } from './useAuth';

export const useCommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    if (!user) return;

    try {
      const data = await CommunityChatStorage.getMessages();
      // Mark messages as own if they match the current user
      const processedMessages = data.map(msg => ({
        ...msg,
        isOwn: msg.userId === user.id,
      }));
      // Use functional setState to only update if messages actually changed
      setMessages((prevMessages) => {
        const prevIds = prevMessages.map(m => m.id).join(',');
        const newIds = processedMessages.map(m => m.id).join(',');
        if (prevIds !== newIds) {
          return processedMessages;
        }
        return prevMessages;
      });
    } catch (error) {
      console.error('Error loading community chat messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMessages();
      // Set up periodic refresh to check for new messages
      const interval = setInterval(() => {
        loadMessages();
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [user, loadMessages]);

  const sendMessage = useCallback(async (message: string): Promise<CommunityMessage> => {
    if (!user) throw new Error('User not authenticated');

    const username = user.username || 'Anonymous';
    const communityMessage = await CommunityChatStorage.sendMessage(user.id, username, message);
    await loadMessages();
    return communityMessage;
  }, [user, loadMessages]);

  const refreshMessages = useCallback(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages,
  };
};
