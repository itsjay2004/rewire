# Streak System

## 1. Feature Overview
The core tracking mechanism. It calculates the time elapsed since the last relapse down to seconds. Tracks "longest streak," "total relapses," and "urges resisted" (from check-ins or rescue mode). Highlights large typography for streak duration.

## 2. UX Flow
1. User opens app -> Home screen.
2. Centered large text: "XX Days, YY Hours, ZZ Mins".
3. Underneath: Progress bar or circular tracker for current immediate goal (e.g., reaching 7 days).
4. Quick stat row: "Urges Resisted: X", "Total Relapses: Y".
5. Prominent "I Need Help" (Rescue Mode) button and "Log Relapse" button below.

## 3. UI Components Needed
- **`StreakTimer` Component**: Uses `requestAnimationFrame` or `setInterval` to update the MM:SS without re-rendering the entire Redux/Zustand state tree (local state for tick).
- **`StatCard` Component**: Small square cards for "Longest Streak", "Resisted".

## 4. Data Required
- **Input**: Current time, Database `Streaks` where `is_active = 1`.
- **Output**: Formatted DD:HH:MM:SS string.

## 5. State Management Logic
- Zustand store action `fetchActiveStreak()` triggered on app launch or focus.
- Calculate difference between `current_time` and `active_streak.start_date`.

## 6. Edge Cases
- App placed in background and resumed: The JS interval might sleep. Use `AppState` from React Native to sync the timer accurate to device clock immediately upon foregrounding.

## 7. Implementation Steps
1. Create `StreakTimer.tsx` UI component.
2. Connect it to the SQLite `getCurrentStreak()` query.
3. If no active streak exists, create one with `start_date` = now.
4. Setup `setInterval` to update the visual timer every second.
5. Create UI layout with bold Typography and the Primary Yellow Theme.
