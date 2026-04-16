import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { Typography } from './Typography';
import { Colors } from '@/src/utils/theme';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.6;

export function BreathingCircle() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);
  const [text, setText] = React.useState('Inhale');

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 4000, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
      -1,
      true
    );

    opacity.value = withRepeat(
      withTiming(0.8, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    const interval = setInterval(() => {
      setText((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
    }, 4000);

    return () => clearInterval(interval);
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: interpolateColor(scale.value, [1, 1.5], [Colors.primary, '#FFF59D']),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]} />
      <View style={styles.textOverlay}>
        <Typography variant="h2" color={Colors.textOnPrimary}>
          {text}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CIRCLE_SIZE * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 0,
  },
  textOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
