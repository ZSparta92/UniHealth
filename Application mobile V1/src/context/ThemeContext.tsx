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

  const colors = useMemo(() => getColors(theme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
