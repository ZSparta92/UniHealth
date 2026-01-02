import { useState, useEffect, useCallback } from 'react';
import { ActivityStorage } from '../storage/activityStorage';
import { Activity, ActivitySession, ActivityProgress } from '../models/Activity';
import { useAuth } from './useAuth';

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<ActivitySession[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshActivities = useCallback(async () => {
    if (!user?.id) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allActivities = await ActivityStorage.getAllActivities(user.id);
      setActivities(allActivities);
    } catch (error) {
      console.error('Error refreshing activities:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const refreshSessions = useCallback(async () => {
    if (!user?.id) {
      setSessions([]);
      return;
    }

    try {
      const allSessions = await ActivityStorage.getAllSessions(user.id);
      setSessions(allSessions);
    } catch (error) {
      console.error('Error refreshing sessions:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshActivities();
    refreshSessions();
  }, [refreshActivities, refreshSessions]);

  const getActivityById = useCallback(
    async (activityId: string): Promise<Activity | null> => {
      if (!user?.id) return null;
      return ActivityStorage.getActivityById(user.id, activityId);
    },
    [user?.id]
  );

  const createCustomActivity = useCallback(
    async (activity: Omit<Activity, 'id' | 'isCustom' | 'createdBy' | 'createdAt'>): Promise<Activity> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const newActivity = await ActivityStorage.createCustomActivity(user.id, activity);
      await refreshActivities();
      return newActivity;
    },
    [user?.id, refreshActivities]
  );

  const updateCustomActivity = useCallback(
    async (activityId: string, updates: Partial<Activity>): Promise<Activity | null> => {
      if (!user?.id) return null;
      
      const updated = await ActivityStorage.updateCustomActivity(user.id, activityId, updates);
      await refreshActivities();
      return updated;
    },
    [user?.id, refreshActivities]
  );

  const deleteCustomActivity = useCallback(
    async (activityId: string): Promise<boolean> => {
      if (!user?.id) return false;
      
      const success = await ActivityStorage.deleteCustomActivity(user.id, activityId);
      await refreshActivities();
      return success;
    },
    [user?.id, refreshActivities]
  );

  const createSession = useCallback(
    async (activityId: string): Promise<ActivitySession> => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const session = await ActivityStorage.createSession(user.id, activityId);
      await refreshSessions();
      return session;
    },
    [user?.id, refreshSessions]
  );

  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<ActivitySession>): Promise<ActivitySession | null> => {
      if (!user?.id) return null;
      
      const updated = await ActivityStorage.updateSession(user.id, sessionId, updates);
      await refreshSessions();
      return updated;
    },
    [user?.id, refreshSessions]
  );

  const getSessionById = useCallback(
    async (sessionId: string): Promise<ActivitySession | null> => {
      if (!user?.id) return null;
      return ActivityStorage.getSessionById(user.id, sessionId);
    },
    [user?.id]
  );

  const getProgress = useCallback(
    async (activityId: string): Promise<ActivityProgress> => {
      if (!user?.id) {
        return {
          activityId,
          totalSessions: 0,
          totalDuration: 0,
          streak: 0,
        };
      }
      return ActivityStorage.getProgress(user.id, activityId);
    },
    [user?.id]
  );

  return {
    activities,
    sessions,
    loading,
    refreshActivities,
    refreshSessions,
    getActivityById,
    createCustomActivity,
    updateCustomActivity,
    deleteCustomActivity,
    createSession,
    updateSession,
    getSessionById,
    getProgress,
  };
};
