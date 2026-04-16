import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, AppState, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/src/components/ui/Typography';
import { Card } from '@/src/components/ui/Card';
import { ActionButton } from '@/src/components/ui/ActionButton';
import { StreakTimer } from '@/src/components/ui/StreakTimer';
import { useStreakStore } from '@/src/store/useStreakStore';
import { useAppStore } from '@/src/store/useAppStore';
import { Colors, Spacing } from '@/src/utils/theme';

export default function HomeScreen() {
  const { 
    currentStreakStartTimestamp, 
    totalResisted, 
    longestStreakDays, 
    isLoading,
    fetchData,
    startNewStreak 
  } = useStreakStore();
  const { openModal } = useAppStore();

  useEffect(() => {
    fetchData();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        fetchData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="label">REWIRE</Typography>
          <Typography variant="h2">Your Progress</Typography>
        </View>

        {/* Streak Hero */}
        <Card elevated style={styles.streakCard}>
          <Typography variant="label" style={styles.streakLabel}>
            {currentStreakStartTimestamp ? 'Current Streak' : 'Ready to Start?'}
          </Typography>
          
          {currentStreakStartTimestamp ? (
            <StreakTimer startTimestamp={currentStreakStartTimestamp} />
          ) : (
            <View style={styles.emptyStreak}>
              <Typography variant="h2" style={styles.centerText}>
                The best time to start was yesterday.
              </Typography>
              <Typography variant="bodySmall" style={styles.centerText}>
                The second best time is right now.
              </Typography>
              <ActionButton 
                label="🚀 Start Streak" 
                onPress={startNewStreak}
                style={styles.startBtn}
              />
            </View>
          )}
        </Card>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Typography variant="caption">Total Resisted</Typography>
            <Typography variant="h2" color={Colors.success}>
              {totalResisted}
            </Typography>
            <Typography variant="caption">urges</Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="caption">Best Streak</Typography>
            <Typography variant="h2" color={Colors.primary}>
              {longestStreakDays}
            </Typography>
            <Typography variant="caption">days</Typography>
          </Card>
        </View>

        {/* Actions */}
        {currentStreakStartTimestamp && (
          <View style={styles.actions}>
            <ActionButton
              label="🧘 Rescue Mode"
              onPress={() => openModal('rescueMode')}
              fullWidth
            />
            <ActionButton
              label="I Relapsed"
              onPress={() => openModal('relapse')}
              variant="ghost"
              fullWidth
              style={styles.relapseBtn}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
  },
  streakCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.xs,
    minHeight: 240,
    justifyContent: 'center',
  },
  streakLabel: {
    marginBottom: Spacing.sm,
  },
  emptyStreak: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  centerText: {
    textAlign: 'center',
  },
  startBtn: {
    marginTop: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  relapseBtn: {
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: 9999,
  },
});
