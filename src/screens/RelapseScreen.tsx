import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/src/components/ui/Typography';
import { ActionButton } from '@/src/components/ui/ActionButton';
import { PillSelector } from '@/src/components/ui/PillSelector';
import { Card } from '@/src/components/ui/Card';
import { Colors, Spacing } from '@/src/utils/theme';
import { StreaksRepository } from '@/src/db/repositories/StreaksRepository';
import { RelapsesRepository } from '@/src/db/repositories/RelapsesRepository';
import { useStreakStore } from '@/src/store/useStreakStore';
import { getDb } from '@/src/db';

const TRIGGER_OPTIONS = ['Boredom', 'Stress', 'Loneliness', 'Social Media', 'Fatigue', 'Angry', 'Late Night'];
const EMOTION_OPTIONS = ['Guilty', 'Frustrated', 'Relieved', 'Indifferent', 'Determined', 'Sad'];

export default function RelapseScreen() {
  const [step, setStep] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const [formData, setFormData] = useState({
    trigger: '',
    thoughts: '',
    activity: '',
    emotion: '',
    prevention: '',
    notes: '',
  });

  const { fetchData } = useStreakStore();

  const handleReset = async () => {
    setIsFinishing(true);
    const db = getDb();
    
    try {
      // Perform as a transaction
      db.withTransactionSync(() => {
        const now = new Date().toISOString();
        const activeStreak = StreaksRepository.getActiveStreak();
        
        if (activeStreak) {
          // 1. Deactivate current
          StreaksRepository.deactivateCurrentStreak(now);
          
          // 2. Log relapse
          RelapsesRepository.insert({
            streak_id: activeStreak.id,
            timestamp: now,
            trigger: formData.trigger,
            thoughts: formData.thoughts,
            activity: formData.activity,
            emotion: formData.emotion,
            prevention_note: formData.prevention,
            general_notes: formData.notes,
          });
        }
        
        // 3. Start a fresh new streak immediately
        StreaksRepository.createStreak(now);
      });

      fetchData(); // Sync global state
      setStep(7); // Show motivational screen
    } catch (error) {
      console.error('Relapse Reset Error:', error);
      Alert.alert('Error', 'Failed to reset streak. Please try again.');
      setIsFinishing(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (step === 7) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <View style={styles.motivationalContainer}>
          <Typography variant="hero" style={styles.centerText}>🌱</Typography>
          <Typography variant="h1" style={styles.centerText}>New Beginning</Typography>
          <Typography variant="body" color={Colors.textSecondary} style={styles.centerText}>
             “Fall seven times, stand up eight.” Your progress isn’t lost, your experience is simply growing. Let’s start again.
          </Typography>
          <ActionButton 
            label="Back to Dashboard" 
            onPress={() => router.replace('/(tabs)')} 
            style={{ marginTop: Spacing.xl }}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Typography variant="label" color={Colors.danger}>RESET WARNING</Typography>
              <Typography variant="h1">Are you sure?</Typography>
              <Typography variant="body">
                This will end your current streak. We want to help you learn from this moment so it doesn’t happen again.
              </Typography>
              <View style={styles.actions}>
                <ActionButton label="Yes, I Relapsed" onPress={nextStep} variant="danger" fullWidth />
                <ActionButton label="Nevermind" onPress={() => router.back()} variant="ghost" fullWidth />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">The Trigger</Typography>
              <Typography variant="bodySmall">What sparked the urge?</Typography>
              <PillSelector 
                options={TRIGGER_OPTIONS} 
                selected={formData.trigger} 
                onSelect={(val) => setFormData({ ...formData, trigger: val })}
                horizontal={false}
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Your Thoughts</Typography>
              <Typography variant="bodySmall">What were you thinking just before?</Typography>
              <Card padding="sm" style={styles.inputCard}>
                <TextInput
                  multiline
                  placeholder="I was thinking about..."
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.textArea}
                  value={formData.thoughts}
                  onChangeText={(val) => setFormData({ ...formData, thoughts: val })}
                />
              </Card>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Emotional State</Typography>
              <Typography variant="bodySmall">How do you feel right now?</Typography>
              <PillSelector 
                options={EMOTION_OPTIONS} 
                selected={formData.emotion} 
                onSelect={(val) => setFormData({ ...formData, emotion: val })}
                horizontal={false}
              />
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Prevention</Typography>
              <Typography variant="bodySmall">What could you have done differently?</Typography>
              <Card padding="sm" style={styles.inputCard}>
                <TextInput
                  multiline
                  placeholder="Next time I will..."
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.textArea}
                  value={formData.prevention}
                  onChangeText={(val) => setFormData({ ...formData, prevention: val })}
                />
              </Card>
            </View>
          )}

          {step === 6 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Final Review</Typography>
              <Typography variant="bodySmall">Anything else to log before reset?</Typography>
              <Card padding="sm" style={styles.inputCard}>
                <TextInput
                  multiline
                  placeholder="Additional notes..."
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.textArea}
                  value={formData.notes}
                  onChangeText={(val) => setFormData({ ...formData, notes: val })}
                />
              </Card>
              <ActionButton 
                label="Confirm & Reset Streak" 
                variant="danger" 
                loading={isFinishing}
                onPress={handleReset}
                fullWidth
              />
            </View>
          )}

          {step > 1 && step < 6 && (
            <View style={styles.footerActions}>
              <ActionButton label="Back" variant="ghost" onPress={prevStep} style={{ flex: 1 }} />
              <ActionButton 
                label="Next" 
                onPress={nextStep} 
                disabled={step === 2 && !formData.trigger}
                style={{ flex: 1 }} 
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  container: { padding: Spacing.lg, gap: Spacing.xl },
  stepContainer: { gap: Spacing.lg, minHeight: 400 },
  actions: { gap: Spacing.sm, marginTop: Spacing.xl },
  footerActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  inputCard: { minHeight: 150, backgroundColor: Colors.surfaceAlt },
  textArea: { color: Colors.text, fontSize: 16, textAlignVertical: 'top', padding: Spacing.sm, flex: 1 },
  motivationalContainer: { padding: Spacing.xl, alignItems: 'center', gap: Spacing.lg },
  centerText: { textAlign: 'center' },
});
