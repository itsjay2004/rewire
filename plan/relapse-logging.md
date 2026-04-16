# Relapse Logging

## 1. Feature Overview
When a relapse occurs, the user goes through a guided questionnaire to log deep behavioral data. This helps build a personalized dataset to prevent future relapses by understanding triggers.

## 2. UX Flow
1. User taps "I Relapsed" button on Home.
2. Warning modal: "Are you sure? This will reset your streak."
3. Questionnaire screen:
   - Time of relapse (defaults to now, editable).
   - Trigger selection (Boredom, Stress, Loneliness, Social Media, etc.).
   - "What were you thinking before?" (Text input).
   - "What were you doing?" (Text input).
   - Emotional state (Pill selectors).
   - "Could it have been prevented?" (Optional text).
4. On Submit:
   - Streak resets to 0.
   - Screen shows a supportive/motivational quote (No shame!).
   - Navigates back to Home.

## 3. UI Components Needed
- **`WarningModal`**
- **Form Layout** with varied inputs (Date picker, Pickers/Selects, TextInputs).
- **`MotivationalOverlay`**: Full screen message post-submit.

## 4. Data Required
- Compiles a complete `Relapse` payload object.

## 5. Storage Interaction
1. Start an SQLite Transaction.
2. Mark current streak `is_active = 0`, set `end_date = now()`.
3. Insert row into `Relapses` table with `streak_id` attached.
4. Create a new row in `Streaks` table with `start_date = now()`, `is_active = 1`.
5. Commit Transaction.

## 6. Edge Cases
- User abandons the relapse form halfway: The streak should NOT be reset until the form is successfully submitted.

## 7. Implementation Steps
1. Create the Relapse Questionnaire UI screens.
2. Implement the Transactional SQLite query logic to ensure data consistency.
3. Update Zustand store to reflect newly created blank streak.
4. Add the motivational transition screen returning to Home.
