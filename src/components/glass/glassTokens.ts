// ============================================================
// LIQUID GLASS — shared style tokens
// Ported from liquid-glass-kit.html. These are the colors and
// recipes the GlassButton / GlassCard reuse so the whole
// "frosted acrylic" look stays consistent.
//
// RN reality (read me): React Native can't do CSS inset / multi
// box-shadows or radial-gradient. We fake the depth by stacking
// a BlurView + LinearGradient overlays + a white inner border +
// a colored outer glow (iOS shadowColor; Android elevation).
// ============================================================

import { Platform } from 'react-native';

// Soft pastel page background (matches the HTML kit body)
export const glassBackground = {
  base: '#EFEEF4',
  topGlow: '#EEEDF6',
  bottomGlow: '#ECEEF4',
};

// Per-variant recipe. `tint` = the vertical gradient painted over
// the frosted base. `glow` = the colored light that bleeds out the
// bottom edge. `edge` = the inner bottom highlight color.
export const glassVariants = {
  purple: {
    tint: ['rgba(228,221,253,0.55)', 'rgba(250,249,255,0.30)', 'rgba(216,206,250,0.50)'] as const,
    glow: 'rgba(176,150,252,0.9)',
    edge: 'rgba(182,160,252,0.55)',
    label: '#16161C',
  },
  teal: {
    tint: ['rgba(216,247,236,0.55)', 'rgba(250,255,253,0.30)', 'rgba(200,242,224,0.50)'] as const,
    glow: 'rgba(120,225,185,0.9)',
    edge: 'rgba(150,228,196,0.6)',
    label: '#16161C',
  },
  // Neutral frosted card surface (the iridescent folder/modal look)
  card: {
    tint: ['rgba(255,255,255,0.55)', 'rgba(248,247,253,0.28)', 'rgba(232,228,248,0.42)'] as const,
    glow: 'rgba(180,170,230,0.45)',
    edge: 'rgba(255,255,255,0.7)',
    label: '#26262E',
  },
} as const;

export type GlassVariant = keyof typeof glassVariants;

// Shared bits
export const glassWhiteBorder = 'rgba(255,255,255,0.85)';
export const glassRadius = {
  pill: 999,
  card: 22,
};

// A colored "transmitted light" glow under an element.
// iOS renders colored shadows; Android only does grey elevation,
// so we bump elevation and accept the difference.
export const coloredGlow = (color: string, radius = 16, elevation = 8) =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 0.7,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 11 },
      shadowOpacity: 0.7,
      shadowRadius: radius,
    },
  });
