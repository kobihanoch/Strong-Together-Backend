import pushNotificationsQueue from "../queues/pushNotifications/pushNotificationsQueue.js";
import { sendPushNotification } from "../services/pushService.js";

export const startPushWorker = async () => {
  try {
    // Try to run the worker
    pushNotificationsQueue.process(5, async (job) => {
      const { token, title, body } = job.data;
      try {
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          console.log(`Skipping expired push to ${token}`);
          return;
        }

        await sendPushNotification(token, title, body);
        console.log("[Push worker]: Push sent to", token);
      } catch (e) {
        console.error(
          `[Push worker]: Failed to send push to ${token}: ${e.message}`
        );
        throw e;
      }
    });
    console.log("[Push worker]: Push worker is up");
  } catch (e) {
    console.error("[Push worker]: Push worker failed to start:", e.message);
    throw e;
  }

  return pushNotificationsQueue; // For shutdown
};
