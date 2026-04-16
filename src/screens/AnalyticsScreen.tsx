import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Typography } from '@/src/components/ui/Typography';
import { Card } from '@/src/components/ui/Card';
import { Colors, Spacing, Radius } from '@/src/utils/theme';
import { CheckInsRepository } from '@/src/db/repositories/CheckInsRepository';
import { RelapsesRepository } from '@/src/db/repositories/RelapsesRepository';

interface AnalyticsData {
  summary: { resisted: number; checkins: number; relapses: number };
  intensityTrend: { date: string; intensity: number }[];
  triggerDist: { x: string; y: number }[];
  riskHour: number | null;
}

export default function AnalyticsScreen() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(() => {
    try {
      const summary = {
        resisted: CheckInsRepository.getCount(),
        checkins: CheckInsRepository.getCount(),
        relapses: RelapsesRepository.getCount(),
      };
      const intensityTrend = CheckInsRepository.getIntensityTrends();
      const triggerDist = RelapsesRepository.getTriggerDistribution();
      const riskHour = RelapsesRepository.getRiskHour();

      setData({ summary, intensityTrend, triggerDist, riskHour });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics])
  );

  if (loading || !data) {
    return (
      <View style={[styles.safe, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const formatRiskHour = (h: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:00 ${period}`;
  };

  const maxIntensity = Math.max(...data.intensityTrend.map((d) => d.intensity), 1);
  const maxTriggerCount = Math.max(...data.triggerDist.map((d) => d.y), 1);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="label">INSIGHTS</Typography>
          <Typography variant="h2">Progress Analytics</Typography>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.gridItem} padding="sm">
            <Typography variant="h2" color={Colors.success}>{data.summary.checkins}</Typography>
            <Typography variant="caption">Check-Ins</Typography>
          </Card>
          <Card style={styles.gridItem} padding="sm">
            <Typography variant="h2" color={Colors.primary}>{data.summary.relapses}</Typography>
            <Typography variant="caption">Relapses</Typography>
          </Card>
          <Card style={styles.gridItem} padding="sm">
            <Typography variant="h2" color={Colors.info}>{data.summary.resisted}</Typography>
            <Typography variant="caption">Resisted</Typography>
          </Card>
        </View>

        <Card elevated style={styles.predictionCard}>
          <Typography variant="label" color={Colors.primary}>RISK PATTERN</Typography>
          {data.riskHour !== null ? (
            <>
              <Typography variant="h3" style={{ marginTop: Spacing.xs }}>
                High-risk time: {formatRiskHour(data.riskHour)}
              </Typography>
              <Typography variant="bodySmall">
                Statistically, you are most vulnerable around this time. Stay extra vigilant.
              </Typography>
            </>
          ) : (
            <Typography variant="bodySmall" style={{ marginTop: Spacing.xs }}>
              Log more data to reveal your vulnerability patterns.
            </Typography>
          )}
        </Card>

        <View style={styles.section}>
          <Typography variant="h3">Urge Intensity (Last 7 Days)</Typography>
          <Card style={styles.chartCard}>
            {data.intensityTrend.length > 0 ? (
              data.intensityTrend.map((point) => (
                <View key={point.date} style={styles.row}>
                  <Typography variant="caption" color={Colors.textSecondary} style={styles.rowLabel}>
                    {point.date.split('-').slice(1).join('/')}
                  </Typography>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(point.intensity / maxIntensity) * 100}%`,
                          backgroundColor: Colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Typography variant="caption">{point.intensity}</Typography>
                </View>
              ))
            ) : (
              <View style={styles.emptyChart}>
                <Typography variant="bodySmall">Not enough data for trend.</Typography>
              </View>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <Typography variant="h3">Common Triggers</Typography>
          <Card style={styles.chartCard}>
            {data.triggerDist.length > 0 ? (
              data.triggerDist.map((item) => (
                <View key={item.x} style={styles.row}>
                  <Typography variant="caption" style={styles.rowLabel}>{item.x}</Typography>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(item.y / maxTriggerCount) * 100}%`,
                          backgroundColor: Colors.info,
                        },
                      ]}
                    />
                  </View>
                  <Typography variant="caption">{item.y}</Typography>
                </View>
              ))
            ) : (
              <View style={styles.emptyChart}>
                <Typography variant="bodySmall">Log relapses to see trigger data.</Typography>
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  container: { padding: Spacing.lg, gap: Spacing.xl },
  header: { gap: Spacing.xs },
  statsGrid: { flexDirection: 'row', gap: Spacing.md },
  gridItem: { flex: 1, alignItems: 'center', gap: Spacing.xs },
  predictionCard: { backgroundColor: Colors.surfaceAlt, borderLeftWidth: 4, borderLeftColor: Colors.primary },
  section: { gap: Spacing.md },
  chartCard: { gap: Spacing.md },
  emptyChart: { height: 120, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowLabel: { width: 72 },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: Radius.full },
});
