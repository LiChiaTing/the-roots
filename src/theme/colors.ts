export const colors = {
  // Primary Colors - Warm Earthy Palette
  primary: {
    terracotta: '#D2691E',      // Warm terracotta orange
    terracottaLight: '#E6935A', // Lighter terracotta
    terracottaDark: '#A0522D',  // Darker terracotta
    sageGreen: '#9CAF88',       // Sage green
    sageGreenLight: '#B8C9A1',  // Lighter sage green
    sageGreenDark: '#7A8F6A',   // Darker sage green
  },

  // Secondary Colors
  secondary: {
    clay: '#C4A484',           // Warm clay brown
    moss: '#8FBC8F',           // Soft moss green
    warmBeige: '#F5F5DC',      // Warm beige
    softBrown: '#DEB887',      // Soft brown
  },

  // Category Colors (matching the IA)
  categories: {
    admin: '#DC143C',          // Crimson red for Admin
    deals: '#228B22',          // Forest green for Deals
    culture: '#4169E1',        // Royal blue for Culture
  },

  // Semantic Colors
  semantic: {
    success: '#9CAF88',        // Sage green for success
    warning: '#D2691E',        // Terracotta for warning
    error: '#DC143C',          // Crimson for error
    info: '#4169E1',           // Royal blue for info
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    offWhite: '#FEFEFE',
    lightGray: '#F5F5F5',
    gray: '#E0E0E0',
    mediumGray: '#B0B0B0',
    darkGray: '#808080',
    darkerGray: '#404040',
    black: '#000000',
  },

  // Background Colors
  background: {
    primary: '#FEFEFE',        // Off white for main background
    secondary: '#F5F5F5',      // Light gray for secondary backgrounds
    tertiary: '#F0F0F0',       // Even lighter for cards/sections
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#404040',        // Dark gray for primary text
    secondary: '#808080',      // Medium gray for secondary text
    tertiary: '#B0B0B0',       // Light gray for tertiary text
    inverse: '#FFFFFF',        // White text on dark backgrounds
    accent: '#D2691E',         // Terracotta for accent text
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#B0B0B0',
    dark: '#808080',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    heavy: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type Colors = typeof colors;
