import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/src/components/ui/Typography';
import { ActionButton } from '@/src/components/ui/ActionButton';
import { Card } from '@/src/components/ui/Card';
import { Colors, Spacing } from '@/src/utils/theme';
import { useAppStore } from '@/src/store/useAppStore';
import { SettingsRepository } from '@/src/db/repositories/SettingsRepository';

/**
 * EmergencyLockScreen
 * Aggressive focus mode that locks the app interface.
 */

export default function EmergencyLockScreen() {
  const { lockExpiryTimestamp, setLockExpiry } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Prevent back navigation on Android
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

    const timer = setInterval(() => {
      if (lockExpiryTimestamp) {
        const now = Date.now();
        const diff = Math.max(0, Math.floor((lockExpiryTimestamp - now) / 1000));
        setTimeLeft(diff);
        
        if (diff === 0) {
          clearInterval(timer);
          handleComplete();
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      backHandler.remove();
    };
  }, [lockExpiryTimestamp]);

  const handleComplete = () => {
    setLockExpiry(null);
    SettingsRepository.remove('lock_expiry');
    Alert.alert('Lock Lifted', 'Good job staying focused.');
  };

  const startLock = (minutes: number) => {
    const expiry = Date.now() + minutes * 60 * 1000;
    setLockExpiry(expiry);
    SettingsRepository.set('lock_expiry', expiry.toString());
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!lockExpiryTimestamp) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Typography variant="label" color={Colors.danger}>EMERGENCY LOCK</Typography>
          <Typography variant="h1" style={styles.centerText}>Hardcore Focus</Typography>
          <Typography variant="body" color={Colors.textSecondary} style={styles.centerText}>
             Locks the app interface. If you leave the app while locked, you will be bombarded with alerts to return immediately.
          </Typography>

          <View style={styles.options}>
            <Card elevated style={styles.optionCard}>
                <Typography variant="h2">30</Typography>
                <Typography variant="caption">Minutes</Typography>
                <ActionButton 
                    label="Lock 30m" 
                    onPress={() => startLock(30)}
                    variant="danger"
                    style={{ marginTop: Spacing.md }}
                />
            </Card>
            <Card elevated style={styles.optionCard}>
                <Typography variant="h2">60</Typography>
                <Typography variant="caption">Minutes</Typography>
                <ActionButton 
                    label="Lock 1h" 
                    onPress={() => startLock(60)}
                    variant="danger"
                    style={{ marginTop: Spacing.md }}
                />
            </Card>
          </View>
          
          <ActionButton label="Back" variant="ghost" onPress={() => router.back()} fullWidth />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.danger }]}>
      <View style={styles.lockContainer}>
        <Typography variant="hero" color="#fff">🔐</Typography>
        <Typography variant="h1" color="#fff">APP LOCKED</Typography>
        <Typography variant="hero" color="#fff" style={styles.hugeTimer}>
            {formatTime(timeLeft)}
        </Typography>
        <Typography variant="body" color="#fff" style={styles.centerText}>
            Do not leave this screen. Focus and breathe. Triggers are temporary, resolve is permanent.
        </Typography>
        
        {timeLeft === 0 && (
           <ActionButton 
             label="Unlock Now" 
             onPress={() => router.replace('/(tabs)')} 
             style={styles.unlockBtn} 
             fullWidth 
           />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, flex: 1, justifyContent: 'center', gap: Spacing.lg },
  centerText: { textAlign: 'center' },
  options: { flexDirection: 'row', gap: Spacing.md, marginVertical: Spacing.xl },
  optionCard: { flex: 1, alignItems: 'center', backgroundColor: Colors.surfaceAlt },
  lockContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  hugeTimer: { fontSize: 80, fontVariant: ['tabular-nums'] },
  unlockBtn: { backgroundColor: '#fff', paddingVertical: Spacing.lg },
});
