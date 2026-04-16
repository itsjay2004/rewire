import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { NotificationService } from '@/src/services/NotificationService';
import { useAppStore } from '@/src/store/useAppStore';
import { SettingsRepository } from '@/src/db/repositories/SettingsRepository';
import { AppState } from 'react-native';
import { initDb } from '@/src/db';
import { Colors } from '@/src/utils/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { lockExpiryTimestamp, setLockExpiry } = useAppStore();

  useEffect(() => {
    // 1. Init Database
    initDb().catch(err => console.error('DB Init Error:', err));

    // 2. Restore state from Settings
    const savedLock = SettingsRepository.get('lock_expiry');
    if (savedLock) {
      setLockExpiry(Number(savedLock));
    }

    // 3. Notification Setup
    const setupNotifications = async () => {
      const granted = await NotificationService.requestPermissions();
      if (granted) {
        await NotificationService.scheduleCheckInNotifications();
      }
    };
    
    setupNotifications();
    const cleanupNotifications = NotificationService.setupNotificationListeners();

    // 4. Aggressive App State Guard for Lock Mode
    const appStateListener = AppState.addEventListener('change', async (nextState) => {
      // Accessing state via closure - might need careful handling if it changes
      // In this setup, we'll use a direct check for lockExpiryTimestamp
      const currentExpiry = Number(SettingsRepository.get('lock_expiry'));
      
      if (nextState === 'background' && currentExpiry && Date.now() < currentExpiry) {
        // Aggressively alert user to return
        NotificationService.scheduleEmergencyAlert();
      } else if (nextState === 'active') {
        // Clear alerts when returned
        NotificationService.cancelAll();
      }
    });

    return () => {
      cleanupNotifications();
      appStateListener.remove();
    };
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: Colors.background },
          headerStyle: { backgroundColor: Colors.surface },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.primary,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="rescue-mode"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="emergency-lock"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="check-in"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="relapse"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
