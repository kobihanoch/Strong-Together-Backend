import pushNotificationsQueue from "./pushNotificationsQueue.js";

// Add jobs to queue
export const enqueuePushNotifications = async (notifications) => {
  //console.log("Email has arrived!");
  await pushNotificationsQueue.addBulk(
    notifications.map((e) => ({
      data: {
        ...e,
        expiresAt: Date.now() + 1000 * 60 * 10,
      }, // Expires after 10 mins if the worker is down
      opts: {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        //removeOnFail: true,
      },
    }))
  );
  //console.log("Emails are enqueued");
};
