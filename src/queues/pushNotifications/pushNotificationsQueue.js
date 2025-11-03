import Bull from "bull";

let pushNotificationsQueue = globalThis.pushNotificationsQueue || null;

const prefix = process.env.NODE_ENV === "development" ? "dev" : "prod";

if (!pushNotificationsQueue) {
  pushNotificationsQueue = new Bull(
    `${prefix}:pushNotificationsQueue`,
    process.env.REDIS_URL
  );
  globalThis.pushNotificationsQueue = pushNotificationsQueue;
}

export default pushNotificationsQueue;
