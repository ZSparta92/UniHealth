import { useState, useEffect } from 'react';
import { MoodEntry, MoodType, MoodStatistics } from '../models/Mood';
import { MoodStorage } from '../storage/moodStorage';
import { useAuth } from './useAuth';

export const useMood = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [statistics, setStatistics] = useState<MoodStatistics>({ totalEntries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [moodEntries, moodStats] = await Promise.all([
        MoodStorage.getAllEntries(user.id),
        MoodStorage.getStatistics(user.id),
      ]);
      setEntries(moodEntries);
      setStatistics(moodStats);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (mood: MoodType, intensity: number, notes?: string): Promise<MoodEntry> => {
    if (!user) throw new Error('User not authenticated');

    const entry = await MoodStorage.createEntry(user.id, mood, intensity, notes);
    await loadEntries();
    return entry;
  };

  const deleteEntry = async (entryId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    await MoodStorage.deleteEntry(user.id, entryId);
    await loadEntries();
  };

  const getEntryById = async (entryId: string): Promise<MoodEntry | null> => {
    if (!user) return null;
    return await MoodStorage.getEntryById(user.id, entryId);
  };

  return {
    entries,
    statistics,
    loading,
    addEntry,
    deleteEntry,
    getEntryById,
    refreshEntries: loadEntries,
  };
};
