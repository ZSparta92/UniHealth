import { Storage } from './asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { MoodEntry, MoodType } from '../models/Mood';

export const MoodStorage = {
  async getAllEntries(userId: string): Promise<MoodEntry[]> {
    try {
      const data = await Storage.getItem(`${STORAGE_KEYS.MOOD_ENTRIES}:${userId}`);
      if (!data) return [];
      const entries = JSON.parse(data) as MoodEntry[];
      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting mood entries:', error);
      return [];
    }
  },

  async getEntryById(userId: string, entryId: string): Promise<MoodEntry | null> {
    try {
      const entries = await this.getAllEntries(userId);
      return entries.find(entry => entry.id === entryId) || null;
    } catch (error) {
      console.error('Error getting mood entry:', error);
      return null;
    }
  },

  async saveEntry(userId: string, entry: MoodEntry): Promise<void> {
    try {
      const entries = await this.getAllEntries(userId);
      const existingIndex = entries.findIndex(e => e.id === entry.id);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = entry;
      } else {
        entries.push(entry);
      }

      await Storage.setItem(`${STORAGE_KEYS.MOOD_ENTRIES}:${userId}`, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw error;
    }
  },

  async createEntry(
    userId: string,
    mood: MoodType,
    intensity: number,
    notes?: string
  ): Promise<MoodEntry> {
    const now = new Date().toISOString();
    const entry: MoodEntry = {
      id: `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      mood,
      intensity,
      date: now,
      notes,
      createdAt: now,
      updatedAt: now,
    };

    await this.saveEntry(userId, entry);
    return entry;
  },

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    try {
      const entries = await this.getAllEntries(userId);
      const filtered = entries.filter(e => e.id !== entryId);
      await Storage.setItem(`${STORAGE_KEYS.MOOD_ENTRIES}:${userId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  },

  async getStatistics(userId: string) {
    try {
      const entries = await this.getAllEntries(userId);
      if (entries.length === 0) {
        return {
          totalEntries: 0,
        };
      }

      const lastEntry = entries[0]; // Already sorted by date desc
      const totalIntensity = entries.reduce((sum, e) => sum + e.intensity, 0);
      const averageIntensity = totalIntensity / entries.length;

      return {
        totalEntries: entries.length,
        lastMood: lastEntry.mood,
        lastMoodDate: lastEntry.date,
        averageIntensity: Math.round(averageIntensity * 10) / 10,
      };
    } catch (error) {
      console.error('Error getting mood statistics:', error);
      return {
        totalEntries: 0,
      };
    }
  },
};
