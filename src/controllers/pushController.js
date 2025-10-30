import {
  queryGetAllUsersToSendHourlyReminder,
  queryGetAllUsersWithNotificationsEnabled,
} from "../queries/pushQueries.js";
import { enqueuePushNotifications } from "../queues/pushNotifications/pushNotificationsProducer.js";
import { computeDelayFromUTC } from "../utils/pushUtils.js";

// @desc    Sends daily psuh (outside cron)
// @route   GET /api/push/daily
// @access  Public
export const sendDailyPush = async (req, res) => {
  const users = await queryGetAllUsersWithNotificationsEnabled();

  try {
    const pushNotifications = [];

    for (const user of users) {
      pushNotifications.push({
        token: user.push_token,
        title: `Hello, ${user.name.split(" ")[0]}!`,
        body: "Ready to go workout?",
        delay: 0,
      });
    }

    await enqueuePushNotifications(pushNotifications);

    res.json({ success: true, message: "Daily notifications enqueued" });
  } catch (error) {
    console.error("❌ Error sending notifications:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Sends hourly push reminder by calculating avg stats (outside cron)
// @route   GET /api/push/hourlyreminder
// @access  Public
export const sendHourlyReminderPush = async (req, res) => {
  const users = await queryGetAllUsersToSendHourlyReminder();

  try {
    const pushNotifications = [];
    const now = new Date();

    for (const user of users) {
      const delayMs = computeDelayFromUTC(
        now,
        user.estimated_time_utc,
        user.reminder_offset_minutes
      );

      // if time for today already passed -> skip
      if (delayMs === null) {
        continue;
      }

      pushNotifications.push({
        token: user.push_token,
        title: "Workout Reminder",
        body: `${user.name.split(" ")[0]}, get ready! Your ${
          user.split_name
        } workout kicks off in ${user.reminder_offset_minutes} minutes.`,
        delay: delayMs,
      });
    }

    // enqueue all in one batch
    if (pushNotifications.length > 0) {
      await enqueuePushNotifications(pushNotifications);
    }

    res.json({
      success: true,
      message: `Enqueued ${pushNotifications.length} workout reminders`,
    });
  } catch (error) {
    console.error("❌ Error sending hourly reminders:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
