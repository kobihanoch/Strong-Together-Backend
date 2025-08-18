// services/pushService.js
import axios from "axios";

export async function sendPushNotification(token, title, body) {
  try {
    const message = {
      to: token,
      sound: "default",
      title,
      body,
    };

    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });

    console.log(`✅ Notification sent to ${token}`);
  } catch (error) {
    console.error(`❌ Failed to send notification to ${token}:`, error.message);
  }
}
