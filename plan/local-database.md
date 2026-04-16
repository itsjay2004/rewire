# Local Database Design

## 1. Feature Overview
The app requires 100% offline persistence with complex querying capabilities for analytics. SQLite (`expo-sqlite`) is the best fit over Realm (heavy native binary) and AsyncStorage (inefficient for charts).

## 2. Database Choice & Schema Design
**Database**: `expo-sqlite` (Next-gen API)

**Tables**:
*   **`Settings`**: Built on Key-Value pairs (or a single row) for user preferences.
*   **`Streaks`**: Tracks start date, end date, status (active/relapsed).
*   **`CheckIns`**: Every 5 hours logs user state.
*   **`Relapses`**: Deep dive metadata of a fail.

### Schema Details:
**Table: Streaks**
- `id` (INTEGER PK AUTOINCREMENT)
- `start_date` (TEXT - ISO8601)
- `end_date` (TEXT - ISO8601, nullable)
- `is_active` (INTEGER - 0 false, 1 true)

**Table: CheckIns**
- `id` (INTEGER PK AUTOINCREMENT)
- `timestamp` (TEXT - ISO8601)
- `urge_intensity` (INTEGER 1-5)
- `had_urge` (INTEGER)
- `activity` (TEXT)
- `mood` (TEXT)
- `context` (TEXT - time context/social setting)
- `reflection` (TEXT - min 100 words enforced at UI)

**Table: Relapses**
- `id` (INTEGER PK AUTOINCREMENT)
- `streak_id` (INTEGER, FK to Streaks)
- `timestamp` (TEXT - ISO8601)
- `trigger` (TEXT)
- `thoughts` (TEXT)
- `activity` (TEXT)
- `emotion` (TEXT)
- `prevention_note` (TEXT)
- `general_notes` (TEXT)

## 3. Storage Interactions
- Create a `db/index.ts` file handling `SQLite.openDatabaseSync('rewire.db')`.
- Write migration scripts for initial table creation.
- Expose typed DAO (Data Access Object) functions: `getCurrentStreak()`, `insertCheckIn(data)`, `logRelapse(data)`.

## 4. Edge Cases
- **App Updates**: DB schema might change. Incorporate a PRAGMA `user_version` check on app startup for simple migrations.
- **Corrupted Data**: Ensure gracefully fallback if a write fails.

## 5. Implementation Steps
1. Install `expo-sqlite`.
2. Create `src/db/schema.ts` defining `CREATE TABLE` queries.
3. Create `src/db/index.ts` to initialize DB and run initialization queries on app load.
4. Implement basic CRUD functions for the `Streaks` table first to support Home Screen.
