import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/src/utils/theme';

type TypographyVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label';

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
}

export function Typography({
  variant = 'body',
  children,
  color,
  style,
  numberOfLines,
}: TypographyProps) {
  return (
    <Text
      style={[styles.base, styles[variant], color ? { color } : undefined, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    color: Colors.text,
  },
  hero: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.extrabold,
    letterSpacing: -1,
    lineHeight: 56,
  },
  h1: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  h3: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: 26,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: 19,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    lineHeight: 16,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
});
