import { Storage } from './asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { CommunityMessage } from '../models/CommunityChat';

export const CommunityChatStorage = {
  async getMessages(): Promise<CommunityMessage[]> {
    try {
      const data = await Storage.getItem(STORAGE_KEYS.COMMUNITY_CHAT_MESSAGES);
      if (!data) {
        // Initialize with welcome messages if no data exists
        const welcomeMessages: CommunityMessage[] = [
          {
            id: 'welcome_1',
            userId: 'system',
            username: 'Alice',
            message: 'Hello everyone! How are you doing today?',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            isOwn: false,
          },
          {
            id: 'welcome_2',
            userId: 'system',
            username: 'Bob',
            message: 'Great! Just finished my morning meditation.',
            timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
            isOwn: false,
          },
        ];
        await Storage.setItem(STORAGE_KEYS.COMMUNITY_CHAT_MESSAGES, JSON.stringify(welcomeMessages));
        return welcomeMessages;
      }
      const messages = JSON.parse(data) as CommunityMessage[];
      return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error getting community chat messages:', error);
      return [];
    }
  },

  async saveMessage(message: CommunityMessage): Promise<void> {
    try {
      const messages = await this.getMessages();
      messages.push(message);
      await Storage.setItem(STORAGE_KEYS.COMMUNITY_CHAT_MESSAGES, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving community chat message:', error);
      throw error;
    }
  },

  async sendMessage(userId: string, username: string, message: string): Promise<CommunityMessage> {
    const communityMessage: CommunityMessage = {
      id: `community_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      username,
      message,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    await this.saveMessage(communityMessage);
    return communityMessage;
  },

  async clearMessages(): Promise<void> {
    try {
      await Storage.removeItem(STORAGE_KEYS.COMMUNITY_CHAT_MESSAGES);
    } catch (error) {
      console.error('Error clearing community chat messages:', error);
      throw error;
    }
  },
};
