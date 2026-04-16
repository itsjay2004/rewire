# App Architecture

## 1. Feature Overview
Defines the foundational folder structure, component hierarchy, navigation flow, and state management pattern to keep the app clean, scalable, and easy to navigate.

## 2. Folder Structure
```text
/src
  /assets        # Images, fonts, animations (Lottie for breathing)
  /components    # Reusable UI (Buttons, Typography, Cards)
    /ui          # Dumb components (Button, Input, Slider)
    /domain      # Smart components (UrgeScale, StreakCounter)
  /screens       # Main view containers
  /navigation    # React Navigation stacks & tabs
  /store         # Zustand state slices
  /db            # SQLite initialization, schema, migrations, models
  /services      # Notifications, native modules bridging
  /utils         # Date formatters, constants, theme
```

## 3. Navigation Structure
- **RootStack** (StackNavigator)
  - `MainTabs` (BottomTabNavigator)
    - `Home` 
    - `Analytics`
    - `Settings`
  - `RescueMode` (Modal/FullScreen Stack - No tabs)
  - `CheckInFlow` (Modal Stack)
  - `RelapseFlow` (Modal Stack)
  - `EmergencyLock` (Stack)

## 4. UI Components Needed
- **Typography**: Large, bold, clean sans-serif (Inter or similar).
- **Action Button**: Primary buttons with soft yellow background (`#FFD54F`), highly visible.
- **Card**: Elevated white cards with subtle shadows for check-ins/inputs.

## 5. State Management Logic (Zustand)
- **`useAppStore`**: Current active view state, modal visibility.
- **`useStreakStore`**: Holds current streak in memory, fetched closely from DB to avoid jitter.
- *Note:* Most state is intrinsically tied to SQLite. Zustand will cache the currently active metrics (current streak start time, total resisted) to serve UI synchronously without constant DB querying.

## 6. Edge Cases
- Ensure modals (`RescueMode`) can be triggered from ANY tab or background notification.
- Ensure the app feels buttery smooth (use `react-native-reanimated` for transitions if needed).

## 7. Implementation Steps
1. Create `src/` folder tree.
2. Install `react-navigation` and define `RootNavigator` and `TabNavigator`.
3. Create empty placeholder screens for Home, Analytics, Settings.
4. Set up the Zustand store skeleton (`store/useAppStore.ts`).
5. Define Theme constants in `utils/theme.ts` (colors, spacing, fonts).
