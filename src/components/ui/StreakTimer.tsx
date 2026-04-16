import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { getTimeElapsed, formatTimer } from '@/src/utils/date';
import { Colors, Spacing } from '@/src/utils/theme';

interface StreakTimerProps {
  startTimestamp: number;
}

export function StreakTimer({ startTimestamp }: StreakTimerProps) {
  const [elapsed, setElapsed] = useState(getTimeElapsed(startTimestamp));

  useEffect(() => {
    // Initial sync
    setElapsed(getTimeElapsed(startTimestamp));

    const interval = setInterval(() => {
      setElapsed(getTimeElapsed(startTimestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp]);

  return (
    <View style={styles.container}>
      {elapsed.days > 0 && (
        <Typography variant="hero" color={Colors.primary} style={styles.days}>
          {elapsed.days} {elapsed.days === 1 ? 'Day' : 'Days'}
        </Typography>
      )}
      <Typography 
        variant={elapsed.days > 0 ? 'h1' : 'hero'} 
        color={elapsed.days > 0 ? Colors.textSecondary : Colors.primary}
        style={styles.timer}
      >
        {formatTimer(elapsed)}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  days: {
    marginBottom: -Spacing.sm,
  },
  timer: {
    fontVariant: ['tabular-nums'],
  },
});
