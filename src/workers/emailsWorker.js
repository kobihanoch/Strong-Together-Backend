import { sendMail } from "../config/mailer.js";
import emailsQueue from "../queues/emails/emailsQueue.js";

export const startEmailWorker = async () => {
  try {
    // Try to run the worker
    emailsQueue.process(5, async (job) => {
      const { to, subject, html } = job.data;
      try {
        // Preventing overflowing of emails
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          console.log(`Skipping expired email to ${to}`);
          return;
        }

        await sendMail({ to, subject, html });
        console.log("[Email worker]: email sent to", to);
      } catch (e) {
        console.error(
          `[Email worker]: Failed to send email to ${to}: ${e.message}`
        );
        throw e;
      }
    });
    console.log("[Email worker]: Email worker is up");
  } catch (e) {
    console.error("[Email worker]: Email worker failed to start:", e.message);
    throw e;
  }

  return emailsQueue; // For shutdown
};
