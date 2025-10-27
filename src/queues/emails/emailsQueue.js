import Bull from "bull";

let emailsQueue = globalThis.emailsQueue || null;

if (!emailsQueue) {
  emailsQueue = new Bull("emailsQueue", process.env.REDIS_URL);
  globalThis.emailsQueue = emailsQueue;
}

export default emailsQueue;
