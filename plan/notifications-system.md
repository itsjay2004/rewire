# Notifications System

## 1. Feature Overview
The engine powering the offline 5-Hour Check-Ins. Uses `expo-notifications` to schedule dynamic local alerts without any cloud dependency.

## 2. Logic Flow
- On app launch, Request Notification Permissions.
- To handle "every 5 hours" offline robustly, we cannot rely on a single recurring chron task since React Native offline jobs differ drastically between OS.
- **Robust Schedule Strategy**: Whenever the app is opened, cancel all queued check-in notifications. Then, natively schedule the next 5 days worth of 5-hour notifications into the future. (e.g., T+5h, T+10h, T+15h, ... up to ~20 separate notification requests).
- If the user uses the app daily, this queue resets continually. If they abandon it for 3 days, it still faithfully reminds them without fail.

## 3. Smart Notifications (Risk Alerts)
- Risk Time Prediction: Query Relapses table. If a significant percentage of relapses happen at 11 PM, automatically schedule a motivational local notification at 10:45 PM: "Stay strong tonight. You usually struggle around this time. Go to sleep!"

## 4. Implementation Steps
1. Install `expo-notifications`.
2. Configure Android/iOS permissions in `app.json` / code.
3. Write `NotificationService.ts` containing:
   - `requestPermissions()`
   - `buildCheckInQueue()` (Loop that schedules X notifications spacing 5 hours apart).
   - `clearCheckInQueue()`
   - `scheduleRiskTimeNotification(riskHour)`
4. Hook up notification tapped listeners (`addNotificationResponseReceivedListener`) to seamlessly open the Check-In Modal when tapped.
