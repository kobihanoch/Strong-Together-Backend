import Bull, { Queue } from "bull";
import { EmailPayload } from "../../types/dto/emails.dto.ts";

declare global {
  var emailsQueue: Queue<EmailPayload> | undefined;
}

let emailsQueue = globalThis.emailsQueue || null;

const prefix = process.env.NODE_ENV === "development" ? "dev" : "prod";

if (!emailsQueue) {
  emailsQueue = new Bull<EmailPayload>(
    `${prefix}:emailsQueue`,
    process.env.REDIS_URL || "",
  );
  globalThis.emailsQueue = emailsQueue;
}

export default emailsQueue as Queue<EmailPayload>;
