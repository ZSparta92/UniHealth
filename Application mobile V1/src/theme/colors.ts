// Color palette based on screenshots

const lightColors = {
  // Purple shades (main brand color)
  purple: {
    light: '#E0CFF7', // Light purple for headers and backgrounds
    medium: '#B19CD9', // Medium purple for buttons
    dark: '#8E6ABF', // Dark purple for text and accents
    darker: '#5B21B6', // Very dark purple for titles
  },
  
  // Text colors
  text: {
    primary: '#333333', // Dark gray for main text
    secondary: '#666666', // Medium gray for secondary text
    light: '#999999', // Light gray for labels
    white: '#FFFFFF',
    dark: '#000000',
  },
  
  // Background colors
  background: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    gray: '#E8E8E8',
    card: '#F7F7F7',
  },
  
  // Status colors
  status: {
    success: '#00aa00',
    error: '#cc0000',
    warning: '#ffaa00',
    online: '#00aa00',
  },
  
  // Navigation
  navigation: {
    background: '#333333',
    active: '#B19CD9',
    inactive: '#FFFFFF',
  },
};

const darkColors = {
  // Purple shades (main brand color) - légèrement ajustés pour dark mode
  purple: {
    light: '#4C1D95', // Darker purple for headers and backgrounds
    medium: '#6D28D9', // Medium purple for buttons
    dark: '#8B5CF6', // Lighter purple for text and accents
    darker: '#C4B5FD', // Light purple for titles
  },
  
  // Text colors
  text: {
    primary: '#E5E7EB', // Light gray for main text
    secondary: '#9CA3AF', // Medium gray for secondary text
    light: '#6B7280', // Darker gray for labels
    white: '#FFFFFF',
    dark: '#111827', // Dark background color
  },
  
  // Background colors
  background: {
    white: '#111827', // Dark background
    lightGray: '#1F2937', // Dark gray background
    gray: '#374151', // Medium dark gray
    card: '#1F2937', // Dark card background
  },
  
  // Status colors (same in dark mode)
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    online: '#10B981',
  },
  
  // Navigation
  navigation: {
    background: '#111827',
    active: '#8B5CF6',
    inactive: '#9CA3AF',
  },
};

export type ColorScheme = typeof lightColors;

export const colors = lightColors; // Default export for backward compatibility

export const getColors = (theme: 'light' | 'dark'): ColorScheme => {
  return theme === 'dark' ? darkColors : lightColors;
};
