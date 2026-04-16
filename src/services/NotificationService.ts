import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

/**
 * NotificationService
 * Manages local scheduling for 5-hour check-ins and risk-time reminders.
 */

// Configure how notifications should be handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  /**
   * Request permissions from the user.
   */
  requestPermissions: async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  },

  /**
   * Schedule 5 days worth of 5-hour check-in reminders.
   * This ensures reminders continue even if the app isn't opened for a few days.
   */
  scheduleCheckInNotifications: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const FIVE_HOURS_IN_SECONDS = 5 * 60 * 60;
    const TOTAL_NOTIFICATIONS = 24;

    for (let i = 1; i <= TOTAL_NOTIFICATIONS; i++) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for a Check-In 🧘',
          body: 'How are you feeling right now? Logging your mood helps you stay on track.',
          data: { screen: 'check-in' },
          sound: true,
        },
        trigger: {
          seconds: FIVE_HOURS_IN_SECONDS * i,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    }
  },

  /**
   * Set up listeners for notification interactions.
   */
  setupNotificationListeners: () => {
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const screen = response.notification.request.content.data?.screen;
      if (screen === 'check-in') {
        router.push('/check-in' as never);
      }
    });

    return () => {
      responseListener.remove();
    };
  },

  /**
   * Aggressively schedule notifications to bring user back.
   */
  scheduleEmergencyAlert: async () => {
    const alerts = [
      { title: '🚨 EMERGENCY LOCK ACTIVE', body: 'RETURN TO REWIRE NOW.', delay: 1 },
      { title: '⚠️ ALERT: LOCK BYPASS ATTEMPTED', body: 'Come back and finish your focus session.', delay: 5 },
      { title: '🛑 STAY FOCUSED', body: 'Do not leave the app. Your streak depends on it.', delay: 10 },
    ];

    for (const alert of alerts) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: alert.title,
          body: alert.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          seconds: alert.delay,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });
    }
  },

  /**
   * Clear all pending notifications (used when user returns to app).
   */
  cancelAll: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await NotificationService.scheduleCheckInNotifications();
  },

  /**
   * Schedule a specific reminder for high-risk times (e.g. late night).
   */
  scheduleRiskReminder: async (hour: number, minute: number = 0) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Stay Strong tonight! 💪',
        body: "You usually find this time difficult. You've got this, maybe it's time to sleep?",
        sound: true,
      },
      trigger: {
        hour,
        minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });
  },
};
