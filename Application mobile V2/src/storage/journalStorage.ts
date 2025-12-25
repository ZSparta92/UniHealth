import { Storage } from './asyncStorage';
import { JournalEntry, JournalSearchFilters } from '../models/Journal';
import { STORAGE_KEYS } from '../constants/storageKeys';

const getJournalKey = (userId: string): string => {
  return `${STORAGE_KEYS.JOURNAL_ENTRIES}:${userId}`;
};

export const JournalStorage = {
  async getAllEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const key = getJournalKey(userId);
      const data = await Storage.getItem(key);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting journal entries:', error);
      return [];
    }
  },

  async getEntryById(userId: string, entryId: string): Promise<JournalEntry | null> {
    try {
      const entries = await this.getAllEntries(userId);
      return entries.find((entry) => entry.id === entryId) || null;
    } catch (error) {
      console.error('Error getting journal entry:', error);
      return null;
    }
  },

  async saveEntry(userId: string, entry: JournalEntry): Promise<void> {
    try {
      const entries = await this.getAllEntries(userId);
      const index = entries.findIndex((e) => e.id === entry.id);
      
      if (index >= 0) {
        entries[index] = entry;
      } else {
        entries.push(entry);
      }

      // Sort by date descending (newest first)
      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const key = getJournalKey(userId);
      await Storage.setItem(key, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  },

  async createEntry(
    userId: string,
    title: string,
    content: string,
    tags: string[] = [],
    mood?: string
  ): Promise<JournalEntry> {
    const wordCount = content.trim().split(/\s+/).filter((word) => word.length > 0).length;
    const now = new Date().toISOString();

    const entry: JournalEntry = {
      id: `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title: title.trim(),
      content: content.trim(),
      date: now,
      tags,
      mood: mood as any,
      isFavorite: false,
      wordCount,
      createdAt: now,
      updatedAt: now,
    };

    await this.saveEntry(userId, entry);
    return entry;
  },

  async updateEntry(
    userId: string,
    entryId: string,
    updates: Partial<JournalEntry>
  ): Promise<JournalEntry | null> {
    try {
      const entry = await this.getEntryById(userId, entryId);
      if (!entry) return null;

      const updatedEntry: JournalEntry = {
        ...entry,
        ...updates,
        id: entryId, // Ensure ID doesn't change
        userId, // Ensure userId doesn't change
        updatedAt: new Date().toISOString(),
      };

      // Recalculate word count if content changed
      if (updates.content !== undefined) {
        updatedEntry.wordCount = updatedEntry.content
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
      }

      await this.saveEntry(userId, updatedEntry);
      return updatedEntry;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      return null;
    }
  },

  async deleteEntry(userId: string, entryId: string): Promise<boolean> {
    try {
      const entries = await this.getAllEntries(userId);
      const filtered = entries.filter((entry) => entry.id !== entryId);
      
      const key = getJournalKey(userId);
      await Storage.setItem(key, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      return false;
    }
  },

  async toggleFavorite(userId: string, entryId: string): Promise<JournalEntry | null> {
    const entry = await this.getEntryById(userId, entryId);
    if (!entry) return null;

    return this.updateEntry(userId, entryId, { isFavorite: !entry.isFavorite });
  },

  async searchEntries(
    userId: string,
    filters: JournalSearchFilters
  ): Promise<JournalEntry[]> {
    let entries = await this.getAllEntries(userId);

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchLower) ||
          entry.content.toLowerCase().includes(searchLower)
      );
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      entries = entries.filter((entry) =>
        filters.tags!.some((tag) => entry.tags.includes(tag))
      );
    }

    // Filter by mood
    if (filters.mood) {
      entries = entries.filter((entry) => entry.mood === filters.mood);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      entries = entries.filter((entry) => new Date(entry.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      entries = entries.filter((entry) => new Date(entry.date) <= toDate);
    }

    // Filter favorites only
    if (filters.favoritesOnly) {
      entries = entries.filter((entry) => entry.isFavorite);
    }

    return entries;
  },

  async getAllTags(userId: string): Promise<string[]> {
    try {
      const entries = await this.getAllEntries(userId);
      const tagSet = new Set<string>();
      
      entries.forEach((entry) => {
        entry.tags.forEach((tag) => tagSet.add(tag));
      });

      return Array.from(tagSet).sort();
    } catch (error) {
      console.error('Error getting journal tags:', error);
      return [];
    }
  },
};
