import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { Typography } from '@/src/components/ui/Typography';
import { ActionButton } from '@/src/components/ui/ActionButton';
import { Card } from '@/src/components/ui/Card';
import { BreathingCircle } from '@/src/components/ui/BreathingCircle';
import { Colors, Spacing } from '@/src/utils/theme';
import { CheckInsRepository } from '@/src/db/repositories/CheckInsRepository';
import { useStreakStore } from '@/src/store/useStreakStore';

const INITIAL_TIME = 300; // 5 minutes in seconds

const HEALTHY_ACTIONS = [
  { icon: '🚶', text: 'Go for a walk' },
  { icon: '💪', text: '10 Pushups' },
  { icon: '🚰', text: 'Drink Water' },
  { icon: '🚿', text: 'Cold Shower' },
  { icon: '🚽', text: 'Go Pee' },
  { icon: '📖', text: 'Read 2 Pages' },
];

export default function RescueModeScreen() {
  useKeepAwake();
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const { fetchData } = useStreakStore();

  useEffect(() => {
    // Disable hardware back button on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      backHandler.remove();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    // Log a resistance event
    try {
      CheckInsRepository.insert({
        timestamp: new Date().toISOString(),
        urge_intensity: 5,
        had_urge: 1,
        activity: 'Rescue Mode',
        mood: 'Resilient',
        context: 'Urge Survival',
        reflection: 'Completed 5-minute Rescue Mode successfully.',
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Timer Header */}
        <View style={styles.header}>
          <Typography variant="label" color={Colors.primary}>DELAY GRATIFICATION</Typography>
          <Typography variant="hero" style={styles.timerText}>
            {formatTime(timeLeft)}
          </Typography>
          <Typography variant="bodySmall">Wait for the urge to subside.</Typography>
        </View>

        {/* Breathing Visualizer */}
        <View style={styles.breathingContainer}>
          <BreathingCircle />
        </View>

        {/* Action Checklist */}
        <View style={styles.actionSection}>
          <Typography variant="label" style={{ marginBottom: Spacing.sm }}>Deflect with Action</Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionScroll}>
            {HEALTHY_ACTIONS.map((action, i) => (
              <Card key={i} style={styles.actionCard} padding="sm">
                <Typography variant="h1">{action.icon}</Typography>
                <Typography variant="caption" style={{ textAlign: 'center' }}>{action.text}</Typography>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Exit Action */}
        <View style={styles.footer}>
          {timeLeft === 0 || isFinished ? (
            <ActionButton 
              label="I am safe now ✨" 
              onPress={handleFinish} 
              fullWidth 
            />
          ) : (
            <ActionButton 
              label="Exit Early" 
              variant="ghost" 
              onPress={handleFinish} 
              fullWidth
              style={styles.exitBtn}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.lg, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginTop: Spacing.xl, gap: Spacing.xs },
  timerText: { fontVariant: ['tabular-nums'], fontSize: 64 },
  breathingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionSection: { marginBottom: Spacing.xl },
  actionScroll: { gap: Spacing.md, paddingRight: Spacing.xl },
  actionCard: { width: 100, alignItems: 'center', gap: Spacing.xs, backgroundColor: Colors.surfaceAlt },
  footer: { marginBottom: Spacing.lg },
  exitBtn: { opacity: 0.5 },
});
