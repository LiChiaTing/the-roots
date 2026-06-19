// ============================================================
// STYLE 3 — 暖陽軟石 Warm Clay
// Warm, clay-like palette: sand base, honey/sun accents, soft
// embossed feel. Replaces the grey WIREFRAME skeleton.
// Reference: /style3-design-system.html
// Key structure is UNCHANGED so all 17 screens pick up colors
// automatically. Indigo-era palette preserved in colors.original.ts
// (copy it back over this file to restore).
// ============================================================

export const colors = {
  // Brand — primary action = 蜂蜜金 Honey · secondary = 太陽橘 Sun
  primary: {
    indigo: '#E3A82E', // Honey — main action, active state, emphasis
    indigoLight: '#F4C863', // Honey light
    indigoDark: '#B07A14', // Honey deep
    lavender: '#F6862E', // Sun — brand, greeting, illustration accent
    lavenderLight: '#FBCF8E', // Sun light
    lavenderDark: '#C96A1E', // Sun deep
  },

  // Warm accent — Honey gold
  accent: {
    gold: '#E3A82E',
    goldLight: '#F4C863',
    goldDark: '#B07A14',
  },

  // Category colors (content IA) — distinct, all warm
  categories: {
    admin: '#B7A8E0', // 薰衣草 Lavender — 證件與行政
    deals: '#7FA653', // 苗綠 Leaf — 優惠/成長
    culture: '#E8AFA4', // 蜜桃粉 Peach — 社群/文化
  },

  // Semantic — warm-tinted
  semantic: {
    success: '#5C8B45', // Leaf deep
    warning: '#F6862E', // Sun
    error: '#B5564A', // Warm brick red
    info: '#B07A14', // Honey deep
    successBg: '#EAF0E0',
    warningBg: '#FBF0D8',
    errorBg: '#F6E4DF',
    infoBg: '#F5EFE2',
  },

  // Neutrals — warm sand-based greys (never cold)
  neutral: {
    white: '#FFFDF6', // 晨光 Highlight — warm white, never pure
    offWhite: '#F5EFE2',
    lightGray: '#E3DAC8',
    gray: '#C2B69C', // Ink-3
    mediumGray: '#8D8678', // 砂礫 Ink-2
    darkGray: '#6B6457',
    darkerGray: '#44403A',
    black: '#211D16', // 墨土 Ink
  },

  // Backgrounds — warm sand (never pure white)
  background: {
    primary: '#EFE9DC', // 暖沙 Sand — base material
    secondary: '#F5EFE2',
    tertiary: '#E3DAC8',
    overlay: 'rgba(33, 29, 22, 0.5)',
  },

  // Text
  text: {
    primary: '#211D16', // Ink
    secondary: '#6B6457',
    tertiary: '#8D8678', // Ink-2
    inverse: '#FFFDF6',
    accent: '#B07A14', // Honey deep — links/accent text
  },

  // Borders — warm sand lines
  border: {
    light: '#E3DAC8',
    medium: '#C2B69C',
    dark: '#B9A887', // 沙影 Shadow
  },

  // Shadows — warm, sand-tinted (restored from flat wireframe)
  shadow: {
    light: 'rgba(185, 168, 135, 0.25)',
    medium: 'rgba(185, 168, 135, 0.40)',
    heavy: 'rgba(33, 29, 22, 0.25)',
  },
} as const;

export type Colors = typeof colors;
