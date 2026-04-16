/**
 * Rewire App – Global Theme Constants
 * Primary palette: deep dark background + soft yellow (#FFD54F) accent.
 */

export const Colors = {
  primary: '#FFD54F',       // Soft yellow – main action color
  primaryDark: '#F9A825',   // Deeper yellow for pressed states
  primaryMuted: '#FFF9C4',  // Very light yellow for backgrounds

  background: '#0E0E12',    // Near-black base
  surface: '#1A1A22',       // Slightly elevated cards
  surfaceAlt: '#22222E',    // Second-level cards

  text: '#F0F0F5',          // Near-white primary text
  textSecondary: '#9090A8', // Muted grey text
  textOnPrimary: '#1A1100', // Dark text on yellow buttons

  border: '#2A2A38',
  divider: '#1E1E2A',

  success: '#66BB6A',
  danger: '#EF5350',
  warning: '#FFA726',
  info: '#42A5F5',

  // Tab bar
  tabActive: '#FFD54F',
  tabInactive: '#4A4A5A',
  tabBar: '#13131A',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 48,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const Theme = {
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  Shadow,
};

export default Theme;
