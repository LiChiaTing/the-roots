import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface GradientPillProps {
  label: string;
  icon?: IconName;
  compact?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Honey gradient pill — the Style 3 暖陽軟石 primary action.
 * `GradientPill` is presentational (use inside an already-pressable parent);
 * `PrimaryButton` wraps it in its own touchable.
 */
export function GradientPill({
  label,
  icon,
  compact,
  fullWidth,
  disabled,
  style,
}: GradientPillProps) {
  const shape = [
    styles.pill,
    compact && styles.pillCompact,
    fullWidth && styles.pillFull,
    style,
  ];
  const labelStyle = [styles.label, compact && styles.labelCompact];

  if (disabled) {
    return (
      <View style={[shape, styles.pillDisabled]}>
        <Text style={[labelStyle, styles.labelDisabled]}>{label}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#F4C863', '#E3A82E']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={shape}
    >
      <Text style={labelStyle}>{label}</Text>
      {icon ? (
        <Ionicons name={icon} size={compact ? 14 : 16} color={theme.colors.text.inverse} />
      ) : null}
    </LinearGradient>
  );
}

interface PrimaryButtonProps extends GradientPillProps {
  onPress: () => void;
}

export function PrimaryButton({ onPress, disabled, style, ...rest }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={style}
    >
      <GradientPill disabled={disabled} {...rest} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    borderRadius: 9999,
    paddingVertical: 13,
    paddingHorizontal: 22,
    // warm honey emboss
    boxShadow:
      '-2px -2px 6px rgba(255, 253, 246, 0.4), 3px 3px 10px rgba(176, 122, 20, 0.45)',
  },
  pillCompact: {
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  pillFull: {
    alignSelf: 'stretch',
  },
  pillDisabled: {
    backgroundColor: theme.colors.neutral.gray,
    boxShadow: 'none',
  },
  label: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.inverse,
  },
  labelCompact: {
    fontSize: theme.typography.fontSize.sm,
  },
  labelDisabled: {
    color: theme.colors.neutral.offWhite,
  },
});
