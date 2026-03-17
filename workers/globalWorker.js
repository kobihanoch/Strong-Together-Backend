import { startAnalyzVideoWorker } from "./analyzeVideoWorker.js";
import { startEmailWorker } from "./emailsWorker.js";
import { startPushWorker } from "./pushNotificationsWorker.js";
import { setupGracefulShutdown } from "./utils/setupGracefulShutdown.js";

export const startGlobalWorker = async () => {
  console.log("Starting global worker...");
  const queues = [];

  // All worker types here
  const emailQueue = await startEmailWorker(); // Start the process returns the queue
  const pushNotificationsQueue = await startPushWorker();
  const analyzeVideoQueue = await startAnalyzVideoWorker();

  // Pushing every worker's queue to the array for future graceful shutdown
  queues.push(emailQueue);
  queues.push(pushNotificationsQueue);
  queues.push(analyzeVideoQueue);

  // Graceful shutdown
  await setupGracefulShutdown(queues);

  console.log("--------------------------------------------------");
};

await startGlobalWorker();
