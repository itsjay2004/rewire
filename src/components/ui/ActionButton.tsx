import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius, FontSize, FontWeight, Spacing } from '@/src/utils/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ActionButtonProps) {
  const containerStyle = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={containerStyle}
      activeOpacity={0.75}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.textOnPrimary : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.45,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.danger,
  },

  // Labels
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  primaryLabel: {
    color: Colors.textOnPrimary,
  },
  secondaryLabel: {
    color: Colors.text,
  },
  ghostLabel: {
    color: Colors.primary,
  },
  dangerLabel: {
    color: '#fff',
  },
});
