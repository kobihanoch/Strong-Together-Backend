import Bull from "bull";

let pushNotificationsQueue = globalThis.pushNotificationsQueue || null;

if (!pushNotificationsQueue) {
  pushNotificationsQueue = new Bull(
    "pushNotificationsQueue",
    process.env.REDIS_URL
  );
  globalThis.pushNotificationsQueue = pushNotificationsQueue;
}

export default pushNotificationsQueue;
