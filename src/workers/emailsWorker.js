import emailQueue from "../../queues/emailQueue.js";
import { sendMail } from "../config/mailer.js";

export const startEmailWorker = async () => {
  try {
    // Try to run the worker
    emailQueue.process(5, async (job) => {
      const { to, subject, html } = job.data;
      try {
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          console.log(`⏱️ Skipping expired email to ${to}`);
          return;
        }

        await sendMail({ to, subject, html });
        console.log("Email worker: email sent to", to);
      } catch (e) {
        console.log(`❌ Failed to send email to ${to}: ${e.message}`);
        throw e;
      }
    });
    console.log("Email worker is up - ready for sending emails!");
  } catch (e) {
    console.log("Email worker failed to start:", e.message);
    throw e;
  }

  return emailQueue; // For shutdown
};
