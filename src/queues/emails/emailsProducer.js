import emailQueue from "./emailsQueue";

// Add jobs to queue
export const enqueueEmails = async (emails) => {
  //console.log("Email has arrived!");
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
      },
    }))
  );
  //console.log("Emails are enqueued");
};
