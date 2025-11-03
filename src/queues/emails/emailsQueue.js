import Bull from "bull";

let emailsQueue = globalThis.emailsQueue || null;

const prefix = process.env.NODE_ENV === "development" ? "dev" : "prod";

if (!emailsQueue) {
  emailsQueue = new Bull(`${prefix}:emailsQueue`, process.env.REDIS_URL);
  globalThis.emailsQueue = emailsQueue;
}

export default emailsQueue;
