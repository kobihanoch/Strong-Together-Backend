import { sendPushNotification } from "../services/pushService.js";

export const sendDailyPush = async (req, res) => {
  const userTokens = ["ExponentPushToken[QXwVCmErETgYSflnH2H8Jv]"];

  try {
    for (const token of userTokens) {
      await sendPushNotification(
        token,
        "Good Morning Kobi!",
        "Ready to go workout?"
      );
    }
    res.json({ success: true, message: "Daily notifications sent" });
  } catch (error) {
    console.error("❌ Error sending notifications:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
