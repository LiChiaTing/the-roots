import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  glassVariants,
  glassWhiteBorder,
  glassRadius,
  coloredGlow,
  GlassVariant,
} from './glassTokens';

interface GlassButtonProps {
  label: string;
  variant?: Extract<GlassVariant, 'purple' | 'teal'>;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Jelly / liquid-glass button. Built by stacking, bottom → top:
 *  1. BlurView          — frosted acrylic base
 *  2. LinearGradient    — the colored tint (light top, color bottom)
 *  3. bottom edge glow  — inner highlight bleeding up from the base
 *  4. white inner border — the crisp rim around the pill
 *  5. small reflection   — sharp white speck bottom-right
 *  6. label             — bold dark text printed on the glass
 * The colored "transmitted light" under the button comes from
 * coloredGlow() on the outer wrapper.
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  variant = 'purple',
  onPress,
  style,
}) => {
  const v = glassVariants[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.glowWrap,
        coloredGlow(v.glow, 18, 10),
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.clip}>
        <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />

        {/* colored tint */}
        <LinearGradient
          colors={v.tint}
          locations={[0, 0.5, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* bottom inner edge glow — the jelly depth bleeding up from the base */}
        <LinearGradient
          colors={['transparent', 'transparent', v.edge]}
          locations={[0, 0.42, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* white inner rim */}
        <View pointerEvents="none" style={styles.rim} />

        {/* sharp reflection speck */}
        <View pointerEvents="none" style={styles.reflection} />

        <Text style={[styles.label, { color: v.label }]}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  glowWrap: {
    borderRadius: glassRadius.pill,
    alignSelf: 'flex-start',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  clip: {
    borderRadius: glassRadius.pill,
    overflow: 'hidden',
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: glassRadius.pill,
    borderWidth: 1.5,
    borderColor: glassWhiteBorder,
  },
  reflection: {
    position: 'absolute',
    right: 16,
    bottom: 7,
    width: 22,
    height: 7,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.95)',
    transform: [{ rotate: '-20deg' }],
  },
  label: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    letterSpacing: 0.2,
  },
});
