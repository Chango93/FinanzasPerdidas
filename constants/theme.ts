// Finverge - Cyberpunk RPG Finance Theme

export const Colors = {
  // Core Background
  background: '#121212',
  surface: '#1A1A1A',
  surfaceLight: '#242424',

  // Neon Accents
  neonGreen: '#39FF14',
  electricPurple: '#BF00FF',
  cyanBlue: '#00D9FF',
  crimsonRed: '#FF0040',

  // Status Colors
  health: '#39FF14',      // Budget health - neon green
  energy: '#00D9FF',      // Savings energy - cyan blue
  danger: '#FF0040',      // Warnings - crimson red
  debt: '#BF00FF',        // Debt/Boss - electric purple

  // UI States
  success: '#39FF14',
  warning: '#FFD700',
  error: '#FF0040',
  info: '#00D9FF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  textMuted: '#505050',

  // Borders & Dividers
  border: '#2A2A2A',
  borderActive: '#39FF14',
  divider: '#1F1F1F',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  glassOverlay: 'rgba(18, 18, 18, 0.8)',

  // Gradients
  gradient: {
    primary: ['#39FF14', '#00D9FF'] as const,
    purple: ['#BF00FF', '#8B00BF'] as const,
    danger: ['#FF0040', '#BF0030'] as const,
    dark: ['#1A1A1A', '#121212'] as const,
  },
};

export const Typography = {
  // Font Families
  mono: 'JetBrainsMono',
  sans: 'Inter',

  // Font Sizes
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 22,
  '3xl': 28,
  '4xl': 36,
  '5xl': 48,

  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Shadows = {
  neonGreen: {
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  purple: {
    shadowColor: '#BF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  cyan: {
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Animation = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// XP and Level System
export const GameConfig = {
  xpPerLevel: 5000,
  xpForLogging: 25,
  xpForMission: {
    daily: 50,
    weekly: 200,
    special: 100,
  },
  streakBonus: 1.5, // 50% bonus for maintaining streak

  // Classes
  classes: [
    {
      id: 'saver',
      name: 'The Saver',
      description: 'Master of accumulation. Build your fortress brick by brick.',
      icon: '🏰',
      bonuses: '+20% XP on savings deposits',
    },
    {
      id: 'investor',
      name: 'The Investor',
      description: 'Risk taker. Turn pennies into empires.',
      icon: '📈',
      bonuses: '+30% XP on investment tracking',
    },
    {
      id: 'minimalist',
      name: 'The Minimalist',
      description: 'Less is more. Cut the fat, keep the essentials.',
      icon: '✂️',
      bonuses: '+25% XP on expense reduction',
    },
  ],
};
