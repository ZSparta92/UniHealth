import { Storage } from './asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { ChatMessage, ChatSession } from '../models/Chat';

export const ChatStorage = {
  async getMessages(userId: string, therapistId: string): Promise<ChatMessage[]> {
    try {
      const data = await Storage.getItem(`${STORAGE_KEYS.CHAT_MESSAGES}:${userId}:${therapistId}`);
      if (!data) return [];
      const messages = JSON.parse(data) as ChatMessage[];
      return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  },

  async saveMessage(userId: string, message: ChatMessage): Promise<void> {
    try {
      const messages = await this.getMessages(userId, message.therapistId);
      messages.push(message);
      await Storage.setItem(
        `${STORAGE_KEYS.CHAT_MESSAGES}:${userId}:${message.therapistId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  },

  async sendMessage(
    userId: string,
    therapistId: string,
    message: string
  ): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      therapistId,
      senderId: userId,
      senderType: 'user',
      message,
      timestamp: new Date().toISOString(),
    };

    await this.saveMessage(userId, chatMessage);
    
    // Simulate therapist response after 1-2 seconds
    setTimeout(async () => {
      const responses = [
        'Thank you for reaching out. How can I help you today?',
        'I understand. Can you tell me more about what you\'re experiencing?',
        'That sounds challenging. Let\'s explore this together.',
        'Thank you for sharing that with me. How long have you been feeling this way?',
        'I\'m here to support you. What would be most helpful right now?',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const therapistMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        therapistId,
        senderId: therapistId,
        senderType: 'therapist',
        message: randomResponse,
        timestamp: new Date().toISOString(),
      };
      
      await this.saveMessage(userId, therapistMessage);
    }, 1000 + Math.random() * 1000);

    return chatMessage;
  },

  async getChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const data = await Storage.getItem(`${STORAGE_KEYS.CHAT_SESSIONS}:${userId}`);
      if (!data) return [];
      return JSON.parse(data) as ChatSession[];
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  },

  async createOrUpdateChatSession(
    userId: string,
    therapistId: string,
    therapistName: string
  ): Promise<void> {
    try {
      const sessions = await this.getChatSessions(userId);
      const existingIndex = sessions.findIndex(s => s.therapistId === therapistId);
      
      const messages = await this.getMessages(userId, therapistId);
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

      const session: ChatSession = {
        therapistId,
        therapistName,
        lastMessage: lastMessage?.message,
        lastMessageTime: lastMessage?.timestamp,
        unreadCount: 0, // Could be enhanced with read tracking
      };

      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }

      await Storage.setItem(`${STORAGE_KEYS.CHAT_SESSIONS}:${userId}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },
};
