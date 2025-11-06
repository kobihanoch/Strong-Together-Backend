import emailQueue from "./emailsQueue.js";

// Add jobs to queue
export const enqueueEmails = async (emails) => {
  //console.log("Email has arrived!");
  try {
    await emailQueue.addBulk(
      emails.map((e) => ({
        data: {
          ...e,
          expiresAt: Date.now() + 1000 * 60 * 60 * 12,
        }, // Expires after 12 hours if the worker is down
        opts: {
          attempts: 3,
          backoff: 5000,
          removeOnComplete: true,
          //removeOnFail: true,
        },
      }))
    );
    console.log(`[Email producer]: Enqueued ${emails.length} emails`);
  } catch {}
};
