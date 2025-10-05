import { queryGetAllUsersWithNotificationsEnabled } from "../queries/pushQueries.js";
import { sendPushNotification } from "../services/pushService.js";

export const sendDailyPush = async (req, res) => {
  const users = await queryGetAllUsersWithNotificationsEnabled();
  console.log(users);
  try {
    for (const user of users) {
      await sendPushNotification(
        user.push_token,
        `Hello, ${user.name.split(" ")[0]}!`,
        "Ready to go workout?"
      );
    }
    res.json({ success: true, message: "Daily notifications sent" });
  } catch (error) {
    console.error("❌ Error sending notifications:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
