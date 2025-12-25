import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Storage } from '../storage/asyncStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getColors, ColorScheme } from '../theme/colors';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => Promise<void>;
  colors: ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await Storage.getItem(STORAGE_KEYS.THEME_MODE);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      await Storage.setItem(STORAGE_KEYS.THEME_MODE, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = useMemo(() => {
    try {
      const result = getColors(theme);
      // Runtime validation: ensure result is valid
      if (!result || typeof result !== 'object') {
        console.error('[ThemeContext] getColors returned invalid result:', result);
        return getColors('light'); // Fallback to light
      }
      // Diagnostic log to verify colors structure at runtime
      if (__DEV__) {
        console.log('[ThemeContext] colors shape:', Object.keys(result || {}));
        console.log('[ThemeContext] colors.purple exists:', !!result?.purple);
        console.log('[ThemeContext] colors.text exists:', !!result?.text);
      }
      return result;
    } catch (error) {
      console.error('[ThemeContext] Error in getColors:', error);
      return getColors('light'); // Fallback to light on error
    }
  }, [theme]);

  const contextValue = useMemo(() => {
    // Ensure colors is always defined before creating context value
    const safeColors = colors || getColors('light');
    const value = { theme, toggleTheme, colors: safeColors };
    // Diagnostic log to verify context value structure
    if (__DEV__) {
      console.log('[ThemeContext] contextValue keys:', Object.keys(value));
      console.log('[ThemeContext] contextValue.colors exists:', !!value.colors);
      console.log('[ThemeContext] contextValue.colors type:', typeof value.colors);
    }
    return value;
  }, [theme, toggleTheme, colors]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Runtime safety: ensure colors always exists
  if (!context.colors) {
    console.error('[useTheme] CRITICAL: context.colors is undefined! Context keys:', Object.keys(context));
    // Fallback to light colors as emergency measure
    const fallbackColors = getColors('light');
    return {
      ...context,
      colors: fallbackColors,
    };
  }
  
  // Diagnostic log in dev mode
  if (__DEV__) {
    console.log('[useTheme] Returning context with colors:', !!context.colors);
  }
  
  return context;
}
