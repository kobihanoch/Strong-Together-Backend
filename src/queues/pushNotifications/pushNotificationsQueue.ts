import Bull, { Queue } from "bull";
import { NotificationPayload } from "../../types/dto/notifications.dto.ts";

declare global {
  var pushNotificationsQueue: Queue<NotificationPayload> | undefined;
}

let pushNotificationsQueue = globalThis.pushNotificationsQueue || null;

const prefix = process.env.NODE_ENV === "development" ? "dev" : "prod";

if (!pushNotificationsQueue) {
  pushNotificationsQueue = new Bull<NotificationPayload>(
    `${prefix}:pushNotificationsQueue`,
    process.env.REDIS_URL || "",
  );
  globalThis.pushNotificationsQueue = pushNotificationsQueue;
}

export default pushNotificationsQueue as Queue<NotificationPayload>;
