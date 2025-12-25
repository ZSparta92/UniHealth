import { ColorScheme } from './colors';

// Typography styles - colors must be provided at runtime via useTheme()
// This function creates typography styles with dynamic colors
export const createTypography = (colors: ColorScheme) => ({
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.text.primary,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text.primary,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.text.secondary,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.text.secondary,
  },
});

// Static typography without colors (for backward compatibility if needed)
// Use createTypography(colors) from useTheme() instead
export const typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};
