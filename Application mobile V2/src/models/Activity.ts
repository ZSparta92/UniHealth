import { MoodType } from './Mood';

export type ActivityCategory =
  | 'meditation'
  | 'breathing'
  | 'exercise'
  | 'gratitude'
  | 'mindfulness'
  | 'creative'
  | 'social'
  | 'self_care'
  | 'other';

export type ActivityDifficulty = 'easy' | 'medium' | 'hard';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  duration?: number; // en minutes
  instructions: string[];
  benefits: string[];
  difficulty: ActivityDifficulty;
  icon?: string;
  color?: string;
  isCustom: boolean;
  createdBy?: string; // userId si activité personnalisée
  createdAt: string; // ISO string
}

export interface ActivitySession {
  id: string;
  activityId: string;
  userId: string;
  startTime: string; // ISO string
  endTime?: string; // ISO string
  duration?: number; // en minutes
  notes?: string;
  completed: boolean;
  rating?: number; // 1-5
  moodBefore?: MoodType;
  moodAfter?: MoodType;
  createdAt: string; // ISO string
}

export interface ActivityProgress {
  activityId: string;
  totalSessions: number;
  totalDuration: number; // en minutes
  lastCompleted?: string; // ISO string
  averageRating?: number;
  streak: number; // jours consécutifs
}
