import { MoodType } from './Mood';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string; // ISO string
  tags: string[];
  mood?: MoodType; // Humeur associée
  isFavorite: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalSearchFilters {
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  mood?: MoodType;
  searchText?: string;
  favoritesOnly?: boolean;
}
