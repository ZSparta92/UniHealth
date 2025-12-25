import { Storage } from './asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { User, UserProfile } from '../models/User';

export const UserStorage = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const userId = await Storage.getItem(STORAGE_KEYS.USER_ID);
      if (!userId) return null;

      const userData = await Storage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userData) return null;

      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await Storage.setItem(STORAGE_KEYS.USER_ID, user.id);
      await Storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      if (user.isGuest) {
        await Storage.setItem(STORAGE_KEYS.IS_GUEST, 'true');
      } else {
        await Storage.removeItem(STORAGE_KEYS.IS_GUEST);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async createGuestUser(): Promise<User> {
    const guestId = `guest_${Date.now()}`;
    const now = new Date().toISOString();
    
    const guestUser: User = {
      id: guestId,
      username: 'Guest',
      createdAt: now,
      lastLoginAt: now,
      isGuest: true,
      profileCompleted: false,
    };

    await this.saveUser(guestUser);
    return guestUser;
  },

  async createUser(profile: UserProfile): Promise<User> {
    const userId = `user_${Date.now()}`;
    const now = new Date().toISOString();
    
    const user: User = {
      id: userId,
      username: profile.username,
      email: profile.email,
      createdAt: now,
      lastLoginAt: now,
      isGuest: false,
      profileCompleted: true,
    };

    await this.saveUser(user);
    return user;
  },

  async updateUser(user: Partial<User>): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user found');
    }

    const updatedUser: User = {
      ...currentUser,
      ...user,
      lastLoginAt: new Date().toISOString(),
    };

    await this.saveUser(updatedUser);
  },

  async logout(): Promise<void> {
    try {
      await Storage.removeItem(STORAGE_KEYS.USER_ID);
      await Storage.removeItem(STORAGE_KEYS.USER_DATA);
      await Storage.removeItem(STORAGE_KEYS.IS_GUEST);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const completed = await Storage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed === 'true';
    } catch (error) {
      return false;
    }
  },

  async setOnboardingCompleted(): Promise<void> {
    await Storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  },

  async isFirstLaunch(): Promise<boolean> {
    try {
      const firstLaunch = await Storage.getItem(STORAGE_KEYS.IS_FIRST_LAUNCH);
      if (firstLaunch === null) {
        await Storage.setItem(STORAGE_KEYS.IS_FIRST_LAUNCH, 'false');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Delete all user data but keep account shell (user ID, basic user data, onboarding status)
   * Removes: mood entries, journal entries, activities, bookings, chat messages, community chat
   * Keeps: USER_ID, USER_DATA, IS_GUEST, ONBOARDING_COMPLETED, IS_FIRST_LAUNCH, THEME_MODE
   */
  async deleteUserData(): Promise<void> {
    try {
      const keysToRemove = [
        STORAGE_KEYS.MOOD_ENTRIES,
        STORAGE_KEYS.JOURNAL_ENTRIES,
        STORAGE_KEYS.ACTIVITIES,
        STORAGE_KEYS.ACTIVITY_SESSIONS,
        STORAGE_KEYS.BOOKINGS,
        STORAGE_KEYS.CHAT_MESSAGES,
        STORAGE_KEYS.CHAT_SESSIONS,
        STORAGE_KEYS.COMMUNITY_CHAT_MESSAGES,
      ];

      await Promise.all(keysToRemove.map(key => Storage.removeItem(key)));

      // Reset user profile data but keep account
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        const resetUser: User = {
          ...currentUser,
          email: undefined,
          year: undefined,
          field: undefined,
          profileCompleted: false,
        };
        await this.saveUser(resetUser);
      }
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  },

  /**
   * Delete entire account and all data - resets app to initial state
   * Removes ALL storage keys including user account, onboarding status, etc.
   */
  async deleteAccount(): Promise<void> {
    try {
      // Clear all AsyncStorage
      await Storage.clear();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};
