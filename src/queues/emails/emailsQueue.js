import Bull from "bull";

let emailQueue;

if (!emailQueue) {
  emailQueue = new Bull("emailQueue", process.env.REDIS_URL);
}

export default emailQueue;
