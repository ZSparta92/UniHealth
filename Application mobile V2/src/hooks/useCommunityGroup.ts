import { useState, useEffect, useCallback } from 'react';
import { CommunityGroup, GroupMessage } from '../models/CommunityGroup';
import { CommunityGroupStorage } from '../storage/communityGroupStorage';
import { useAuth } from './useAuth';

/**
 * Check if a user is a psychologist
 * In prototype: check if userId starts with 'therapist_' or is in a list
 */
function isPsychologist(userId: string): boolean {
  return userId.startsWith('therapist_') || userId.includes('psychologist');
}

export const useCommunityGroup = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [availableGroups, setAvailableGroups] = useState<CommunityGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<CommunityGroup | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const userIsPsychologist = user ? isPsychologist(user.id) : false;

  const loadGroups = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userGroups = await CommunityGroupStorage.getUserGroups(user.id, userIsPsychologist);
      setGroups(userGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  }, [user, userIsPsychologist]);

  const loadAvailableGroups = useCallback(async () => {
    if (!user) return;

    try {
      const available = await CommunityGroupStorage.getAllAvailableGroups(user.id, userIsPsychologist);
      setAvailableGroups(available);
    } catch (error) {
      console.error('Error loading available groups:', error);
    }
  }, [user, userIsPsychologist]);

  useEffect(() => {
    if (user) {
      loadGroups();
      loadAvailableGroups();
    }
  }, [user, loadGroups, loadAvailableGroups]);

  const loadGroupMessages = useCallback(async (groupId: string) => {
    if (!user) return;

    try {
      const groupMessages = await CommunityGroupStorage.getGroupMessages(groupId, user.id);
      setMessages(groupMessages);
    } catch (error) {
      console.error('Error loading group messages:', error);
    }
  }, [user]);

  const selectGroup = useCallback(async (group: CommunityGroup) => {
    setCurrentGroup(group);
    await loadGroupMessages(group.id);
  }, [loadGroupMessages]);

  const selectGroupById = useCallback(async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      await selectGroup(group);
    } else {
      // Try to load from storage if not in current groups list
      const loadedGroup = await CommunityGroupStorage.getGroupById(groupId);
      if (loadedGroup) {
        setCurrentGroup(loadedGroup);
        await loadGroupMessages(groupId);
      }
    }
  }, [groups, selectGroup, loadGroupMessages]);

  const sendMessage = useCallback(async (groupId: string, message: string): Promise<GroupMessage | null> => {
    if (!user || !currentGroup) return null;

    try {
      const userDisplayName = await CommunityGroupStorage.getUserDisplayName(groupId, user.id);
      const isSupervisor = userIsPsychologist && currentGroup.supervisorId === user.id;
      const groupMessage = await CommunityGroupStorage.sendGroupMessage(
        groupId,
        user.id,
        userDisplayName,
        message,
        isSupervisor
      );
      
      // Reload messages
      await loadGroupMessages(groupId);
      return groupMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }, [user, currentGroup, userIsPsychologist, loadGroupMessages]);

  const createGroup = useCallback(async (
    theme: string,
    description?: string,
    maxMembers: number = 6
  ): Promise<CommunityGroup | null> => {
    if (!user || !userIsPsychologist) {
      throw new Error('Only psychologists can create groups');
    }

    try {
      // For prototype, use a mock psychologist name
      const supervisorName = 'Dr. Supervisor'; // In real app, get from therapist data
      const newGroup = await CommunityGroupStorage.createGroup(
        user.id,
        supervisorName,
        theme,
        description,
        maxMembers
      );
      
      await loadGroups();
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }, [user, userIsPsychologist, loadGroups]);

  const refreshMessages = useCallback(async () => {
    if (currentGroup) {
      await loadGroupMessages(currentGroup.id);
    }
  }, [currentGroup, loadGroupMessages]);

  const joinGroup = useCallback(async (groupId: string): Promise<CommunityGroup | null> => {
    if (!user) return null;

    try {
      const joinedGroup = await CommunityGroupStorage.joinGroup(groupId, user.id);
      if (joinedGroup) {
        // Reload groups and available groups
        await loadGroups();
        await loadAvailableGroups();
      }
      return joinedGroup;
    } catch (error) {
      console.error('Error joining group:', error);
      return null;
    }
  }, [user, loadGroups, loadAvailableGroups]);

  const leaveGroup = useCallback(async (groupId: string): Promise<boolean> => {
    if (!user) {
      console.log('[useCommunityGroup] leaveGroup: No user');
      return false;
    }

    try {
      console.log('[useCommunityGroup] leaveGroup: Starting for groupId:', groupId);
      const success = await CommunityGroupStorage.leaveGroup(groupId, user.id);
      console.log('[useCommunityGroup] leaveGroup: Storage result:', success);
      
      if (success) {
        // Clear current group if it's the one being left (before reloading)
        if (currentGroup?.id === groupId) {
          console.log('[useCommunityGroup] leaveGroup: Clearing current group state');
          setCurrentGroup(null);
          setMessages([]);
        }
        
        // Reload groups and available groups asynchronously
        // Don't await to avoid blocking navigation
        console.log('[useCommunityGroup] leaveGroup: Reloading groups');
        loadGroups().catch(err => console.error('[useCommunityGroup] Error reloading groups:', err));
        loadAvailableGroups().catch(err => console.error('[useCommunityGroup] Error reloading available groups:', err));
      }
      
      return success;
    } catch (error) {
      console.error('[useCommunityGroup] Error leaving group:', error);
      return false;
    }
  }, [user, currentGroup?.id, loadGroups, loadAvailableGroups]);

  return {
    groups,
    availableGroups,
    currentGroup,
    messages,
    loading,
    userIsPsychologist,
    selectGroup,
    selectGroupById,
    sendMessage,
    createGroup,
    joinGroup,
    leaveGroup,
    refreshGroups: loadGroups,
    refreshAvailableGroups: loadAvailableGroups,
    refreshMessages,
  };
};

