import { useState, useEffect } from 'react';
import { CommunityMessage } from '../models/CommunityChat';
import { CommunityChatStorage } from '../storage/communityChatStorage';
import { useAuth } from './useAuth';

export const useCommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMessages();
      // Set up periodic refresh to check for new messages
      const interval = setInterval(() => {
        loadMessages();
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadMessages = async () => {
    try {
      const data = await CommunityChatStorage.getMessages();
      // Mark messages as own if they match the current user
      const processedMessages = data.map(msg => ({
        ...msg,
        isOwn: msg.userId === user?.id,
      }));
      setMessages(processedMessages);
    } catch (error) {
      console.error('Error loading community chat messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string): Promise<CommunityMessage> => {
    if (!user) throw new Error('User not authenticated');

    const username = user.username || 'Anonymous';
    const communityMessage = await CommunityChatStorage.sendMessage(user.id, username, message);
    await loadMessages();
    return communityMessage;
  };

  const refreshMessages = async () => {
    await loadMessages();
  };

  return {
    messages,
    loading,
    sendMessage,
    refreshMessages,
  };
};
