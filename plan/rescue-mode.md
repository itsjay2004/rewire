# Rescue Mode

## 1. Feature Overview
The MOST IMPORTANT FEATURE. A massive, always visible button on the home screen. When pressed, it enters an immediate intervention state meant to delay gratification and survive the urge.

## 2. UX Flow
1. User taps "Rescue Mode".
2. Screen immediately turns into a full-screen, focused view (no tabs, dark or calming color palette).
3. **Breathing Exercise**: A 120-second Lottie animation of an expanding/contracting circle syncs with an "Inhale... Exhale..." prompt.
4. **Delay Timer**: A 5-minute countdown clock runs concurrently at the top.
5. **Action Checklist**: Below the breathing, quick actions appear: Go for a walk, Do 10 pushups, Drink water, Cold shower, Pee.
6. User cannot easily exit this screen (hide header/back buttons). They must wait or explicitly confirm "I am safe now" to exit.
7. Upon successful survival (user taps "I am safe"), "Urges Resisted" count increases.

## 3. UI Components Needed
- **`BreathingCircle`**: `LottieView` or custom Reanimated component.
- **`CountdownTimer`**: Custom hook ticking down from 300 seconds.
- **`ActionCard`**: Horizontal scroll of suggested healthy actions.
- **`SafeButton`**: Unlocks the UI and returns home.

## 4. State Management Logic
- Screen injected as a React Navigation Modal spanning the entire screen.
- Disable native hardware back button (Android `BackHandler.addEventListener`) while active, letting them leave only via the explicit "I am safe" confirmation.

## 5. Edge Cases
- App Blocking: User might exit the app entirely and go to browser. To mitigate we rely on Emegency Lock fallback behaviors (see `emergency-lock.md`).
- Focus Loss: Keep screen awake using `expo-keep-awake` while in this mode.

## 6. Implementation Steps
1. Install `lottie-react-native` and `expo-keep-awake`.
2. Create `RescueModeScreen.tsx` (FullScreen Modal).
3. Implement 5-minute timer and breathing visualizer.
4. Add the healthy action checklist.
5. Setup the Android Hardware Back handler.
