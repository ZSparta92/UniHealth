import { colors } from './colors';

export const typography = {
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
};
