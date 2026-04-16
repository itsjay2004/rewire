# Emergency Lock Mode

## 1. Feature Overview
A hardcore focus mode restricting access to triggers. The user locks their phone or specific trigger apps for a fixed period (30 mins / 1 hr).

## 2. Technical Feasibility & Constraints (Android via Expo)
Achieving system-level app blocking (blocking YouTube or Chrome) in an Expo React Native environment is tremendously difficult without dropping out of Expo Go and writing custom Java/Kotlin Native Modules utilizing `UsageStatsManager` and `SYSTEM_ALERT_WINDOW` permissions.

### MVP Approach: Aggressive App-State Guard
Instead of trying to block the OS, we make the app aggressively block leaving. If Lock Mode is engaged and the user pushes the app to the background, we bombard them with terrifying local notifications every 5 seconds until they return.

## 3. UX Flow
1. User taps "Emergency Lock".
2. Select duration: 30m or 1h.
3. App enters "Locked State". A giant timer appears.
4. If the user puts the app in the background (`AppState.currentState === 'background'`), the app fires vibrating, repeating local notifications: "🚨 YOU ARE IN EMERGENCY LOCK MODE. RETURN TO REWIRE IMMEDIATELY."
5. Returning clears the notifications.

## 4. UI Components Needed
- **`LockDurationSelector`**: Buttons for setting lock period.
- **`LockActiveScreen`**: Shows a countdown timer of remaining locked time. No back navigation allowed.

## 5. Data Required
- `lock_expiry_time` timestamp saved in `Settings` table locally (prevents bypassing by terminating the app).

## 6. Implementation Steps
1. Add emergency UI and DB storage logic for `lock_expiry_time`.
2. Implement React Native `AppState` listener hook in the root layout.
3. Use `expo-notifications` to schedule an aggressively repeating alert if app is backgrounded while `now() < lock_expiry_time`.
4. Cancel all local notifications when app is foregrounded.
