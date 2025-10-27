import { startEmailWorker } from "./emailsWorker.js";
import { setupGracefulShutdown } from "./utils/setupGracefulShutdown.js";

export const startGlobalWorker = async () => {
  console.log("Starting global worker...");
  const queues = [];

  // All worker types here
  const emailQueue = await startEmailWorker(); // Start the process returns the queue

  // Pushing every worker's queue to the array for future graceful shutdown
  queues.push(emailQueue);

  // Graceful shutdown
  await setupGracefulShutdown(queues);
};

await startGlobalWorker();
