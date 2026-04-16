 # Rewire App - Master Plan

## 🎯 App Overview
A privacy-first, offline-first habit control app designed to help users quit masturbation. Focuses on streak tracking, active awareness via 5-hour check-ins, urge intervention (rescue mode), and deep analytics. The design is minimalistic, fast, with a soft yellow primary theme.

## ⚙️ Tech Stack Choices & Justification
- **Framework**: React Native (Expo). Allows cross-platform rapid iteration.
- **Language**: TypeScript (critical for robust data schema for analytics).
- **State Management**: **Zustand**. Chosen over Redux Toolkit because it's significantly lighter, has less boilerplate, and integrates seamlessly with local persistence (AsyncStorage) for lightweight configs.
- **Database**: **SQLite (`expo-sqlite`)**. Chosen over Realm (heavier, overkill) and AsyncStorage (terrible for querying analytical data). SQLite is perfect for the 5-hour check-ins and relapse logs which require time-series querying.
- **Notifications**: `expo-notifications` (for the offline 5-hour check-in rules).
- **Charts**: `victory-native` for modular, animated analytics.

## 📄 Implementation Plan Files
The project is divided into modular specification files. Start implementation in the order presented below.

1. `/plan/app-architecture.md` - Core folder structure & navigation setup.
2. `/plan/local-database.md` - SQLite schema & data layers.
3. `/plan/streak-system.md` - Streak core logic & UI.
4. `/plan/checkin-system.md` - 5-Hour reminder & reflection system.
5. `/plan/relapse-logging.md` - Relapse form & deep behavior logging.
6. `/plan/rescue-mode.md` - 2-minute urge survival toolkit.
7. `/plan/emergency-lock.md` - App locking / focus mode logic.
8. `/plan/dashboard-analytics.md` - Motivation & insight charts.
9. `/plan/notifications-system.md` - Background local notifications.

---

## 🔄 TODO OF ALL THE THINGS TO DO

- [x] Task 1: Setup React Native Expo project with TypeScript and Zustand. (Reference: `/plan/app-architecture.md`)
- [x] Task 2: Setup Navigation (React Navigation) & Global Theme (Yellow). (Reference: `/plan/app-architecture.md`)
- [x] Task 3: Initialize SQLite Database and Repositories. (Reference: `/plan/local-database.md`)
- [x] Task 4: Implement the Streak Tracking Logic & Home UI. (Reference: `/plan/streak-system.md`)
- [x] Task 5: Implement Notification Permissions & Local Scheduling logic. (Reference: `/plan/notifications-system.md`)
- [x] Task 6: Implement 5-Hour Check-In flow & Reflection screen. (Reference: `/plan/checkin-system.md`)
- [x] Task 7: Implement Relapse Logging Questionnaire. (Reference: `/plan/relapse-logging.md`)
- [x] Task 8: Implement Rescue Mode with 120s timer & interactions. (Reference: `/plan/rescue-mode.md`)
- [x] Task 9: Implement Dashboard & Progress Analytics charts. (Reference: `/plan/dashboard-analytics.md`)
- [x] Task 10: Implement Emergency Lock fallback logic & AppState listener. (Reference: `/plan/emergency-lock.md`)

⏭️ **Project Status**
👉 **Status: Complete.** All core features implemented and wired with local persistence.
