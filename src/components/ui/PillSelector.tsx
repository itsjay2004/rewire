import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Typography } from './Typography';
import { Colors, Radius, Spacing } from '@/src/utils/theme';

interface PillSelectorProps {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  horizontal?: boolean;
}

export function PillSelector({
  options,
  selected,
  onSelect,
  horizontal = true,
}: PillSelectorProps) {
  const content = (
    <View style={[styles.container, !horizontal && styles.vertical]}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
            style={[
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillUnselected,
            ]}
          >
            <Typography
              variant="bodySmall"
              color={isSelected ? Colors.textOnPrimary : Colors.text}
              style={styles.label}
            >
              {option}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (horizontal) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  vertical: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollContent: {
    paddingRight: Spacing.lg,
  },
  pill: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  label: {
    fontWeight: '600',
  },
});
