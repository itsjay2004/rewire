import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Typography } from '@/src/components/ui/Typography';
import { ActionButton } from '@/src/components/ui/ActionButton';
import { PillSelector } from '@/src/components/ui/PillSelector';
import { Card } from '@/src/components/ui/Card';
import { Colors, Spacing, Radius } from '@/src/utils/theme';
import { getWordCount } from '@/src/utils/wordcount';
import { CheckInsRepository } from '@/src/db/repositories/CheckInsRepository';
import { useStreakStore } from '@/src/store/useStreakStore';

const STEPS = 6;
const MIN_WORDS = 100;

const ACTIVITY_OPTIONS = ['Working', 'Studying', 'Exercising', 'Socializing', 'Resting', 'Scrolling', 'Bored'];
const MOOD_OPTIONS = ['Calm', 'Happy', 'Stressed', 'Sad', 'Anxious', 'Bored', 'Energetic'];
const CONTEXT_OPTIONS = ['Alone', 'With Friends', 'Quiet Place', 'Busy Area', 'In Bed'];

export default function CheckInScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    urgeIntensity: 1,
    hadUrge: false,
    activity: '',
    mood: '',
    context: '',
    reflection: '',
  });

  const { fetchData } = useStreakStore();

  const wordCount = useMemo(() => getWordCount(formData.reflection), [formData.reflection]);
  const canSubmit = step === STEPS && wordCount >= MIN_WORDS;

  const nextStep = () => {
    if (step < STEPS) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      CheckInsRepository.insert({
        timestamp: new Date().toISOString(),
        urge_intensity: formData.urgeIntensity,
        had_urge: formData.hadUrge ? 1 : 0,
        activity: formData.activity,
        mood: formData.mood,
        context: formData.context,
        reflection: formData.reflection,
      });
      
      // Refresh global stats (total resisted)
      fetchData();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Submit Check-In Error:', error);
    }
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <Typography variant="caption">Step {step} of {STEPS}</Typography>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / STEPS) * 100}%` }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {renderProgress()}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Urge Intensity</Typography>
              <Typography variant="bodySmall">How strong are your urges right now?</Typography>
              <View style={styles.intensityRow}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[styles.intensityCircle, formData.urgeIntensity === val && styles.activeCircle]}
                    onPress={() => setFormData({ ...formData, urgeIntensity: val })}
                  >
                    <Typography 
                      variant="h3" 
                      color={formData.urgeIntensity === val ? Colors.textOnPrimary : Colors.text}
                    >
                      {val}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
              <Typography variant="caption" style={{ textAlign: 'center' }}>
                1 = Minimal | 5 = Very Strong
              </Typography>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Did you feel an urge?</Typography>
              <Typography variant="bodySmall">In the last 5 hours, did any urge arise?</Typography>
              <View style={styles.actions}>
                <ActionButton 
                  label="Yes" 
                  variant={formData.hadUrge ? "primary" : "secondary"}
                  onPress={() => setFormData({ ...formData, hadUrge: true })}
                />
                <ActionButton 
                  label="No" 
                  variant={!formData.hadUrge ? "primary" : "secondary"}
                  onPress={() => setFormData({ ...formData, hadUrge: false })}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Your Activity</Typography>
              <Typography variant="bodySmall">What have you been doing?</Typography>
              <PillSelector 
                options={ACTIVITY_OPTIONS} 
                selected={formData.activity} 
                onSelect={(val) => setFormData({ ...formData, activity: val })}
                horizontal={false}
              />
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Current Mood</Typography>
              <Typography variant="bodySmall">How is your mental state?</Typography>
              <PillSelector 
                options={MOOD_OPTIONS} 
                selected={formData.mood} 
                onSelect={(val) => setFormData({ ...formData, mood: val })}
                horizontal={false}
              />
            </View>
          )}

          {step === 5 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Social Context</Typography>
              <Typography variant="bodySmall">Where and with whom are you?</Typography>
              <PillSelector 
                options={CONTEXT_OPTIONS} 
                selected={formData.context} 
                onSelect={(val) => setFormData({ ...formData, context: val })}
                horizontal={false}
              />
            </View>
          )}

          {step === 6 && (
            <View style={styles.stepContainer}>
              <Typography variant="h2">Reflection</Typography>
              <Typography variant="bodySmall">Write about your last 5 hours. (Min 100 words)</Typography>
              <Card padding="sm" style={styles.inputCard}>
                <TextInput
                  multiline
                  placeholder="Today has been..."
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.textArea}
                  value={formData.reflection}
                  onChangeText={(val) => setFormData({ ...formData, reflection: val })}
                />
              </Card>
              <Typography 
                variant="caption" 
                color={wordCount >= MIN_WORDS ? Colors.success : Colors.danger}
                style={{ alignSelf: 'flex-end' }}
              >
                {wordCount} / {MIN_WORDS} words
              </Typography>
            </View>
          )}

          <View style={[styles.actions, step === 1 && { justifyContent: 'flex-end' }]}>
            {step > 1 && (
              <ActionButton 
                label="Back" 
                variant="ghost" 
                onPress={prevStep} 
                style={{ flex: 1 }}
              />
            )}
            {step < STEPS ? (
              <ActionButton 
                label="Next" 
                onPress={nextStep} 
                style={{ flex: 1 }}
              />
            ) : (
              <ActionButton 
                label="Submit" 
                disabled={!canSubmit} 
                onPress={handleSubmit}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, gap: Spacing.xl },
  progressContainer: { gap: Spacing.xs },
  progressBar: { height: 4, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary },
  stepContainer: { gap: Spacing.lg, minHeight: 300 },
  intensityRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  intensityCircle: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 1.5, 
    borderColor: Colors.border, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: Colors.surface 
  },
  activeCircle: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  actions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  inputCard: { flex: 1, minHeight: 200, backgroundColor: Colors.surfaceAlt },
  textArea: { 
    color: Colors.text, 
    fontSize: 16, 
    textAlignVertical: 'top', 
    padding: Spacing.sm,
    height: '100%' 
  },
});
