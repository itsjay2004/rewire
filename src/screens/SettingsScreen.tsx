import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/src/components/ui/Typography';
import { Card } from '@/src/components/ui/Card';
import { Colors, Spacing } from '@/src/utils/theme';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography variant="label">PREFERENCES</Typography>
          <Typography variant="h2">Settings</Typography>
        </View>

        <Card elevated style={styles.placeholder}>
          <Typography variant="h3" color={Colors.textSecondary}>
            ⚙️ Settings coming soon
          </Typography>
          <Typography variant="bodySmall" style={styles.sub}>
            Notification schedule, emergency lock config, and app preferences.
          </Typography>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    gap: Spacing.xs,
  },
  placeholder: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  sub: {
    textAlign: 'center',
    maxWidth: 260,
  },
});
