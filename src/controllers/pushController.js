import { queryGetAllUsersWithNotificationsEnabled } from "../queries/pushQueries.js";
import { enqueuePushNotifications } from "../queues/pushNotifications/pushNotificationsProducer.js";

export const sendDailyPush = async (req, res) => {
  const users = await queryGetAllUsersWithNotificationsEnabled();
  try {
    const pushNotifications = [];
    for (const user of users) {
      pushNotifications.push({
        token: user.push_token,
        title: `Hello, ${user.name.split(" ")[0]}!`,
        body: "Ready to go workout?",
      });
    }

    await enqueuePushNotifications(pushNotifications);
    res.json({ success: true, message: "Daily notifications sent" });
  } catch (error) {
    console.error("❌ Error sending notifications:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
