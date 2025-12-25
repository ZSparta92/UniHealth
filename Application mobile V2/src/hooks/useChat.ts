import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, ChatSession } from '../models/Chat';
import { ChatStorage } from '../storage/chatStorage';
import { useAuth } from './useAuth';

export const useChat = (therapistId?: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef<ChatMessage[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const loadMessages = useCallback(async (therapistIdParam: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await ChatStorage.getMessages(user.id, therapistIdParam);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadSessions = useCallback(async () => {
    if (!user) return;

    try {
      const data = await ChatStorage.getChatSessions(user.id);
      setSessions(data);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) {
      loadSessions();
      if (therapistId) {
        loadMessages(therapistId);
      }
    }
  }, [user, therapistId, loadSessions, loadMessages]);

  // Periodic refresh - use functional setState to avoid stale closures
  useEffect(() => {
    if (!therapistId || !user) return;

    const interval = setInterval(async () => {
      try {
        const updatedMessages = await ChatStorage.getMessages(user.id, therapistId);
        // Use functional setState to compare with latest state
        setMessages((prevMessages) => {
          // Only update if messages actually changed (by ID comparison)
          const prevIds = prevMessages.map(m => m.id).join(',');
          const newIds = updatedMessages.map(m => m.id).join(',');
          if (prevIds !== newIds) {
            return updatedMessages;
          }
          return prevMessages;
        });
      } catch (error) {
        console.error('Error refreshing messages:', error);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [therapistId, user]);

  const sendMessage = useCallback(async (message: string): Promise<ChatMessage> => {
    if (!user || !therapistId) throw new Error('User or therapist not specified');

    const chatMessage = await ChatStorage.sendMessage(user.id, therapistId, message);
    await loadMessages(therapistId);
    await loadSessions();
    return chatMessage;
  }, [user, therapistId, loadMessages, loadSessions]);

  const initializeChat = useCallback(async (therapistIdParam: string, therapistName: string) => {
    if (!user) throw new Error('User not authenticated');

    await ChatStorage.createOrUpdateChatSession(user.id, therapistIdParam, therapistName);
    await loadSessions();
    await loadMessages(therapistIdParam);
  }, [user, loadSessions, loadMessages]);

  const refreshMessages = useCallback(() => {
    if (therapistId) {
      loadMessages(therapistId);
    }
  }, [therapistId, loadMessages]);

  return {
    messages,
    sessions,
    loading,
    sendMessage,
    initializeChat,
    refreshMessages,
    refreshSessions: loadSessions,
  };
};
