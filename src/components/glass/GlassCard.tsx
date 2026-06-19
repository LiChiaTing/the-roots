import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  glassVariants,
  glassWhiteBorder,
  glassRadius,
  coloredGlow,
} from './glassTokens';

interface GlassCardProps {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Pull in a faint colored glow (purple / teal). Defaults to soft neutral. */
  glowVariant?: 'purple' | 'teal' | 'card';
}

/**
 * Frosted-glass card. Same layering idea as GlassButton but tuned
 * for a large translucent surface: a soft iridescent tint, a white
 * top sheen, a crisp white rim, and a gentle colored outer glow.
 * Drop any content inside via children.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  onPress,
  style,
  glowVariant = 'card',
}) => {
  const v = glassVariants[glowVariant];
  const Wrapper: any = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[styles.glowWrap, coloredGlow(v.glow, 26, 6), style]}
    >
      <View style={styles.clip}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />

        {/* iridescent tint */}
        <LinearGradient
          colors={v.tint}
          locations={[0, 0.5, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* top sheen */}
        <LinearGradient
          colors={['rgba(255,255,255,0.55)', 'transparent']}
          locations={[0, 0.4]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* white inner rim */}
        <View pointerEvents="none" style={styles.rim} />

        <View style={styles.content}>{children}</View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  glowWrap: {
    borderRadius: glassRadius.card,
  },
  clip: {
    borderRadius: glassRadius.card,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: glassRadius.card,
    borderWidth: 1.5,
    borderColor: glassWhiteBorder,
  },
  content: {
    padding: 22,
  },
});
