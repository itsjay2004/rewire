import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Shadow } from '@/src/utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  elevated?: boolean;
}

export function Card({
  children,
  style,
  padding = 'md',
  elevated = false,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        styles[`padding_${padding}`],
        elevated ? styles.elevated : styles.flat,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flat: {},
  elevated: {
    ...Shadow.md,
    borderColor: Colors.border,
  },

  padding_none: { padding: 0 },
  padding_sm: { padding: Spacing.sm },
  padding_md: { padding: Spacing.md },
  padding_lg: { padding: Spacing.lg },
});
