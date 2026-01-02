import { useState, useEffect, useCallback } from 'react';
import { JournalStorage } from '../storage/journalStorage';
import { JournalEntry, JournalSearchFilters } from '../models/Journal';
import { useAuth } from './useAuth';

export const useJournal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshEntries = useCallback(async () => {
    if (!user?.id) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allEntries = await JournalStorage.getAllEntries(user.id);
      setEntries(allEntries);
    } catch (error) {
      console.error('Error refreshing journal entries:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const getEntryById = useCallback(
    async (entryId: string): Promise<JournalEntry | null> => {
      if (!user?.id) return null;
      return JournalStorage.getEntryById(user.id, entryId);
    },
    [user?.id]
  );

  const createEntry = useCallback(
    async (
      title: string,
      content: string,
      tags: string[] = [],
      mood?: string
    ): Promise<JournalEntry> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const entry = await JournalStorage.createEntry(
        user.id,
        title,
        content,
        tags,
        mood
      );
      await refreshEntries();
      return entry;
    },
    [user?.id, refreshEntries]
  );

  const updateEntry = useCallback(
    async (
      entryId: string,
      updates: Partial<JournalEntry>
    ): Promise<JournalEntry | null> => {
      if (!user?.id) return null;
      
      const updated = await JournalStorage.updateEntry(user.id, entryId, updates);
      await refreshEntries();
      return updated;
    },
    [user?.id, refreshEntries]
  );

  const deleteEntry = useCallback(
    async (entryId: string): Promise<boolean> => {
      if (!user?.id) return false;
      
      const success = await JournalStorage.deleteEntry(user.id, entryId);
      await refreshEntries();
      return success;
    },
    [user?.id, refreshEntries]
  );

  const toggleFavorite = useCallback(
    async (entryId: string): Promise<JournalEntry | null> => {
      if (!user?.id) return null;
      
      const updated = await JournalStorage.toggleFavorite(user.id, entryId);
      await refreshEntries();
      return updated;
    },
    [user?.id, refreshEntries]
  );

  const searchEntries = useCallback(
    async (filters: JournalSearchFilters): Promise<JournalEntry[]> => {
      if (!user?.id) return [];
      return JournalStorage.searchEntries(user.id, filters);
    },
    [user?.id]
  );

  const getAllTags = useCallback(async (): Promise<string[]> => {
    if (!user?.id) return [];
    return JournalStorage.getAllTags(user.id);
  }, [user?.id]);

  return {
    entries,
    loading,
    refreshEntries,
    getEntryById,
    createEntry,
    updateEntry,
    deleteEntry,
    toggleFavorite,
    searchEntries,
    getAllTags,
  };
};
