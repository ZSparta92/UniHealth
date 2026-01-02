import { useState, useEffect } from 'react';
import { ChatMessage, ChatSession } from '../models/Chat';
import { ChatStorage } from '../storage/chatStorage';
import { useAuth } from './useAuth';

export const useChat = (therapistId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessions();
      if (therapistId) {
        loadMessages(therapistId);
      }
    }
  }, [user, therapistId]);

  const loadMessages = async (therapistIdParam: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await ChatStorage.getMessages(user.id, therapistIdParam);
      setMessages(data);
      
      // Check for new messages periodically
      const interval = setInterval(async () => {
        const updatedMessages = await ChatStorage.getMessages(user.id, therapistIdParam);
        if (updatedMessages.length !== messages.length) {
          setMessages(updatedMessages);
        }
      }, 2000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    if (!user) return;

    try {
      const data = await ChatStorage.getChatSessions(user.id);
      setSessions(data);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const sendMessage = async (message: string): Promise<ChatMessage> => {
    if (!user || !therapistId) throw new Error('User or therapist not specified');

    const chatMessage = await ChatStorage.sendMessage(user.id, therapistId, message);
    await loadMessages(therapistId);
    await loadSessions();
    return chatMessage;
  };

  const initializeChat = async (therapistIdParam: string, therapistName: string) => {
    if (!user) throw new Error('User not authenticated');

    await ChatStorage.createOrUpdateChatSession(user.id, therapistIdParam, therapistName);
    await loadSessions();
    await loadMessages(therapistIdParam);
  };

  return {
    messages,
    sessions,
    loading,
    sendMessage,
    initializeChat,
    refreshMessages: therapistId ? () => loadMessages(therapistId) : () => {},
    refreshSessions: loadSessions,
  };
};
