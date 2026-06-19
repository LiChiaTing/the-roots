export const colors = {
  // Brand — Soft Indigo
  primary: {
    indigo: '#4A5FA8',
    indigoLight: '#6B7FC4',
    indigoDark: '#384A8A',
    lavender: '#8B7EC8',
    lavenderLight: '#B0A6DC',
    lavenderDark: '#6B5FA8',
  },

  // Warm accent
  accent: {
    gold: '#E8A838',
    goldLight: '#F2C268',
    goldDark: '#C48820',
  },

  // Category colors (content IA)
  categories: {
    admin: '#D04040',
    deals: '#3DAA7A',
    culture: '#8B7EC8',
  },

  // Semantic
  semantic: {
    success: '#3DAA7A',
    warning: '#E8A838',
    error: '#D04040',
    info: '#4A5FA8',
    successBg: '#EBF7F2',
    warningBg: '#FDF5E6',
    errorBg: '#FDEAEA',
    infoBg: '#EEF1FA',
  },

  // Neutrals
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8F7FC',
    lightGray: '#EEEAF8',
    gray: '#D4D0E8',
    mediumGray: '#9494B0',
    darkGray: '#5C5C7A',
    darkerGray: '#2E2E4A',
    black: '#0E0E1E',
  },

  // Backgrounds (pearl white with lavender tint)
  background: {
    primary: '#F8F7FC',
    secondary: '#EEEAF8',
    tertiary: '#E4E0F4',
    overlay: 'rgba(30, 30, 46, 0.5)',
  },

  // Text
  text: {
    primary: '#1E1E2E',
    secondary: '#5C5C7A',
    tertiary: '#9494B0',
    inverse: '#FFFFFF',
    accent: '#4A5FA8',
  },

  // Borders
  border: {
    light: '#E4E0F4',
    medium: '#C8C2E8',
    dark: '#9494B0',
  },

  // Shadows (indigo-tinted)
  shadow: {
    light: 'rgba(74, 95, 168, 0.08)',
    medium: 'rgba(74, 95, 168, 0.15)',
    heavy: 'rgba(30, 30, 46, 0.25)',
  },
} as const;

export type Colors = typeof colors;
