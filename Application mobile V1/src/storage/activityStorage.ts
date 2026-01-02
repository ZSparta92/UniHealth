import { Storage } from './asyncStorage';
import { Activity, ActivitySession, ActivityProgress } from '../models/Activity';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Mock activities data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'activity_1',
    title: 'Guided Meditation',
    description: 'A peaceful 10-minute guided meditation to help you relax and center yourself.',
    category: 'meditation',
    duration: 10,
    instructions: [
      'Find a quiet, comfortable space',
      'Sit or lie down in a relaxed position',
      'Close your eyes and focus on your breath',
      'Follow the guided instructions',
      'Allow thoughts to pass without judgment',
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and concentration',
      'Promotes better sleep',
    ],
    difficulty: 'easy',
    icon: '🧘',
    color: '#E0CFF7',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'activity_2',
    title: 'Breathing Exercise',
    description: 'Simple breathing technique to calm your mind and body.',
    category: 'breathing',
    duration: 5,
    instructions: [
      'Inhale slowly for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly for 4 counts',
      'Repeat for 5 minutes',
    ],
    benefits: [
      'Calms the nervous system',
      'Reduces anxiety',
      'Increases oxygen flow',
    ],
    difficulty: 'easy',
    icon: '💨',
    color: '#B19CD9',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'activity_3',
    title: 'Gratitude Journal',
    description: 'Write down three things you are grateful for today.',
    category: 'gratitude',
    duration: 5,
    instructions: [
      'Take a moment to reflect on your day',
      'Write down three things you are grateful for',
      'Be specific and detailed',
      'Reflect on how these things make you feel',
    ],
    benefits: [
      'Increases positive emotions',
      'Improves mental well-being',
      'Enhances self-awareness',
    ],
    difficulty: 'easy',
    icon: '✨',
    color: '#8E6ABF',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
];

const getActivitiesKey = (userId: string): string => {
  return `${STORAGE_KEYS.ACTIVITIES}:${userId}`;
};

const getSessionsKey = (userId: string): string => {
  return `${STORAGE_KEYS.ACTIVITY_SESSIONS}:${userId}`;
};

export const ActivityStorage = {
  async getAllActivities(userId: string): Promise<Activity[]> {
    try {
      // Combine mock activities with custom activities
      const key = getActivitiesKey(userId);
      const customData = await Storage.getItem(key);
      const customActivities: Activity[] = customData ? JSON.parse(customData) : [];
      
      return [...MOCK_ACTIVITIES, ...customActivities];
    } catch (error) {
      console.error('Error getting activities:', error);
      return MOCK_ACTIVITIES;
    }
  },

  async getActivityById(userId: string, activityId: string): Promise<Activity | null> {
    try {
      const activities = await this.getAllActivities(userId);
      return activities.find((activity) => activity.id === activityId) || null;
    } catch (error) {
      console.error('Error getting activity:', error);
      return null;
    }
  },

  async createCustomActivity(
    userId: string,
    activity: Omit<Activity, 'id' | 'isCustom' | 'createdBy' | 'createdAt'>
  ): Promise<Activity> {
    try {
      const key = getActivitiesKey(userId);
      const existingData = await Storage.getItem(key);
      const customActivities: Activity[] = existingData ? JSON.parse(existingData) : [];

      const newActivity: Activity = {
        ...activity,
        id: `activity_custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isCustom: true,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      };

      customActivities.push(newActivity);
      await Storage.setItem(key, JSON.stringify(customActivities));

      return newActivity;
    } catch (error) {
      console.error('Error creating custom activity:', error);
      throw error;
    }
  },

  async updateCustomActivity(
    userId: string,
    activityId: string,
    updates: Partial<Activity>
  ): Promise<Activity | null> {
    try {
      const key = getActivitiesKey(userId);
      const existingData = await Storage.getItem(key);
      const customActivities: Activity[] = existingData ? JSON.parse(existingData) : [];

      const index = customActivities.findIndex((a) => a.id === activityId);
      if (index < 0) return null;

      customActivities[index] = { ...customActivities[index], ...updates };
      await Storage.setItem(key, JSON.stringify(customActivities));

      return customActivities[index];
    } catch (error) {
      console.error('Error updating custom activity:', error);
      return null;
    }
  },

  async deleteCustomActivity(userId: string, activityId: string): Promise<boolean> {
    try {
      const key = getActivitiesKey(userId);
      const existingData = await Storage.getItem(key);
      const customActivities: Activity[] = existingData ? JSON.parse(existingData) : [];

      const filtered = customActivities.filter((a) => a.id !== activityId);
      await Storage.setItem(key, JSON.stringify(filtered));

      return true;
    } catch (error) {
      console.error('Error deleting custom activity:', error);
      return false;
    }
  },

  async getAllSessions(userId: string): Promise<ActivitySession[]> {
    try {
      const key = getSessionsKey(userId);
      const data = await Storage.getItem(key);
      if (!data) return [];
      const sessions = JSON.parse(data) as ActivitySession[];
      return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } catch (error) {
      console.error('Error getting activity sessions:', error);
      return [];
    }
  },

  async getSessionById(userId: string, sessionId: string): Promise<ActivitySession | null> {
    try {
      const sessions = await this.getAllSessions(userId);
      return sessions.find((session) => session.id === sessionId) || null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  async createSession(userId: string, activityId: string): Promise<ActivitySession> {
    try {
      const key = getSessionsKey(userId);
      const existingData = await Storage.getItem(key);
      const sessions: ActivitySession[] = existingData ? JSON.parse(existingData) : [];

      const newSession: ActivitySession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        activityId,
        userId,
        startTime: new Date().toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      sessions.push(newSession);
      await Storage.setItem(key, JSON.stringify(sessions));

      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  async updateSession(
    userId: string,
    sessionId: string,
    updates: Partial<ActivitySession>
  ): Promise<ActivitySession | null> {
    try {
      const key = getSessionsKey(userId);
      const existingData = await Storage.getItem(key);
      const sessions: ActivitySession[] = existingData ? JSON.parse(existingData) : [];

      const index = sessions.findIndex((s) => s.id === sessionId);
      if (index < 0) return null;

      sessions[index] = { ...sessions[index], ...updates };
      
      // Calculate duration if endTime is set
      if (updates.endTime && sessions[index].startTime) {
        const start = new Date(sessions[index].startTime);
        const end = new Date(updates.endTime);
        sessions[index].duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      }

      await Storage.setItem(key, JSON.stringify(sessions));
      return sessions[index];
    } catch (error) {
      console.error('Error updating session:', error);
      return null;
    }
  },

  async getProgress(userId: string, activityId: string): Promise<ActivityProgress> {
    try {
      const sessions = await this.getAllSessions(userId);
      const activitySessions = sessions.filter((s) => s.activityId === activityId && s.completed);

      const totalSessions = activitySessions.length;
      const totalDuration = activitySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const ratings = activitySessions.filter((s) => s.rating).map((s) => s.rating!);
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
        : undefined;
      
      const lastCompleted = activitySessions.length > 0
        ? activitySessions[0].endTime
        : undefined;

      // Calculate streak (simplified - checks last 7 days)
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const hasSession = activitySessions.some((s) => {
          if (!s.endTime) return false;
          const sessionDate = new Date(s.endTime);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === checkDate.getTime();
        });
        if (hasSession) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      return {
        activityId,
        totalSessions,
        totalDuration,
        lastCompleted,
        averageRating,
        streak,
      };
    } catch (error) {
      console.error('Error getting progress:', error);
      return {
        activityId,
        totalSessions: 0,
        totalDuration: 0,
        streak: 0,
      };
    }
  },
};
