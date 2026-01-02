export type MoodType =
  | 'very_happy'
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'very_sad'
  | 'anxious'
  | 'angry'
  | 'tired'
  | 'excited'
  | 'calm';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  intensity: number; // 1-10
  date: string; // ISO string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodStatistics {
  totalEntries: number;
  lastMood?: MoodType;
  lastMoodDate?: string;
  averageIntensity?: number;
}
