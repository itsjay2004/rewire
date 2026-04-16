# 5-Hour Check-In System

## 1. Feature Overview
A critical behavioral interrupter. Every 5 hours, the app prompts the user to submit an emotional and contextual snapshot. To foster high awareness, the user MUST write a minimum 100-word reflection to submit.

## 2. UX Flow
1. User taps local notification -> App opens Check-In Modal.
2. Step 1: Urge intensity slider (1-5).
3. Step 2: "Did you feel an urge in last 5 hours?" (Yes/No).
4. Step 3: Pill selectors for Activity (Working, Scrolling, Sleeping, etc.).
5. Step 4: Pill selectors for Mood (Calm, Stressed, Bored, etc.).
6. Step 5: Time context (Alone, With people, etc.).
7. Step 6: Text input for reflection. Shows a dynamic word-count below it: "X / 100 words". Submit button is disabled until 100 words reached.
8. Success animation & redirect to Home.

## 3. UI Components Needed
- **`SliderInput`**: For 1-5 scale.
- **`PillSelector`**: Multiple choice selection chips.
- **`TextAreaCounter`**: Multi-line `TextInput` with word parsing logic.

## 4. Data Required
- **Outputs**: Urge intensity, boolean urge status, activity string, mood string, context string, reflection text.

## 5. State Management Logic
- Temporary state kept within the component hierarchy (`useState` / `useReducer`) until the final submit.
- On submit, call `db.insertCheckIn()` and fetch latest stats to Zustand.

## 6. Storage Interaction
- Insert the compiled object into SQLite `CheckIns` table.
- If `urge_intensity > 3` or `had_urge === 1`, increment the "urges resisted" counter in user stats.

## 7. Edge Cases
- User forces app close during check-in: It's okay, next load can either prompt them again or wait for the next 5-hour mark. For MVP, just require it when they click the notification.
- 100 word minimum might be frustrating. Keep it strict as requested, but ensure the `TextInput` doesn't lag (use controlled component with `memo`).
- Use RegExp `\s+` to accurately count words instead of characters.

## 8. Implementation Steps
1. Build the Check-In form UI (Steps 1 to 6).
2. Implement word counting logic in the `TextAreaCounter`.
3. Hook up the Submit button to write to SQLite.
4. Setup a mechanism to trigger this UI (Route parameter mapping from Notification tap).
