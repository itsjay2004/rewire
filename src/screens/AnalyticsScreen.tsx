import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { VictoryChart, VictoryLine, VictoryBar, VictoryTheme, VictoryAxis, VictoryGroup } from 'victory-native';
import { Typography } from '@/src/components/ui/Typography';
import { Card } from '@/src/components/ui/Card';
import { Colors, Spacing } from '@/src/utils/theme';
import { CheckInsRepository } from '@/src/db/repositories/CheckInsRepository';
import { RelapsesRepository } from '@/src/db/repositories/RelapsesRepository';

const { width } = Dimensions.get('window');

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
        resisted: CheckInsRepository.getCount(), // Simplified resisted count
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Typography variant="label">INSIGHTS</Typography>
          <Typography variant="h2">Progress Analytics</Typography>
        </View>

        {/* Weekly Stats Grid */}
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

        {/* Prediction Card */}
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

        {/* Trend Chart */}
        <View style={styles.section}>
          <Typography variant="h3">Urge Intensity (Last 7 Days)</Typography>
          <Card style={styles.chartCard} padding="none">
            {data.intensityTrend.length > 1 ? (
              <VictoryChart width={width - 50} height={200} theme={VictoryTheme.grayscale} padding={40}>
                <VictoryAxis 
                  style={{ 
                    axis: { stroke: Colors.border }, 
                    tickLabels: { fill: Colors.textSecondary, fontSize: 10 } 
                  }}
                  tickFormat={(x) => x.split('-')[2]} // Just day of month
                />
                <VictoryAxis dependentAxis 
                  style={{ 
                    axis: { stroke: 'transparent' }, 
                    tickLabels: { fill: Colors.textSecondary, fontSize: 10 },
                    grid: { stroke: Colors.divider }
                  }} 
                  domain={[0, 5]}
                />
                <VictoryLine
                  data={data.intensityTrend.map(d => ({ x: d.date, y: d.intensity }))}
                  style={{ data: { stroke: Colors.primary, strokeWidth: 3 } }}
                  animate={{ duration: 1000, onLoad: { duration: 500 } }}
                />
              </VictoryChart>
            ) : (
              <View style={styles.emptyChart}>
                <Typography variant="bodySmall">Not enough data for trend.</Typography>
              </View>
            )}
          </Card>
        </View>

        {/* Trigger Breakdown */}
        <View style={styles.section}>
          <Typography variant="h3">Common Triggers</Typography>
          <Card style={styles.chartCard} padding="none">
            {data.triggerDist.length > 0 ? (
              <VictoryChart width={width - 50} height={220} padding={{ left: 80, right: 30, top: 20, bottom: 40 }}>
                <VictoryAxis 
                  style={{ 
                    axis: { stroke: 'transparent' }, 
                    tickLabels: { fill: Colors.text, fontSize: 11, fontWeight: 'bold' } 
                  }}
                />
                <VictoryBar
                  horizontal
                  data={data.triggerDist}
                  style={{ data: { fill: Colors.primary, width: 20 } }}
                  cornerRadius={{ top: 10, bottom: 10 }}
                  animate={{ duration: 1000 }}
                />
              </VictoryChart>
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
  chartCard: { backgroundColor: Colors.surface, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  emptyChart: { height: 150, justifyContent: 'center', alignItems: 'center' },
});
