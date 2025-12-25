import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models/User';
import { UserStorage } from '../storage/userStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  onboardingCompleted: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string) => Promise<User>;
  continueAsGuest: () => Promise<User>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  deleteUserData: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const loadAuthState = async () => {
    try {
      const [currentUser, isCompleted] = await Promise.all([
        UserStorage.getCurrentUser(),
        UserStorage.isOnboardingCompleted(),
      ]);
      
      setUser(currentUser);
      setOnboardingCompleted(isCompleted);
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthState();
  }, []);

  const refreshAuthState = async () => {
    await loadAuthState();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const currentUser = await UserStorage.getCurrentUser();
      if (currentUser && currentUser.email === email && !currentUser.isGuest) {
        await UserStorage.updateUser({});
        await refreshAuthState();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const register = async (username: string, email: string): Promise<User> => {
    try {
      const newUser = await UserStorage.createUser({ username, email });
      await UserStorage.setOnboardingCompleted();
      await refreshAuthState();
      return newUser;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  };

  const continueAsGuest = async (): Promise<User> => {
    try {
      const guestUser = await UserStorage.createGuestUser();
      await UserStorage.setOnboardingCompleted();
      await refreshAuthState();
      return guestUser;
    } catch (error) {
      console.error('Error creating guest user:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    await UserStorage.setOnboardingCompleted();
    await refreshAuthState();
  };

  const logout = async () => {
    try {
      await UserStorage.logout();
      await refreshAuthState();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const deleteUserData = async () => {
    try {
      await UserStorage.deleteUserData();
      await refreshAuthState();
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await UserStorage.deleteAccount();
      await refreshAuthState();
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        onboardingCompleted,
        isAuthenticated: !!user,
        login,
        register,
        continueAsGuest,
        completeOnboarding,
        logout,
        refreshAuthState,
        deleteUserData,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
