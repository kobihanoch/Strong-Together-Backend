import { createRedisSubscriber } from "../config/redisClient.js";

const VIDEO_ANALYSIS_RESULTS_CHANNEL = "video-analysis:results";

export const startVideoAnalysisSubscriber = async () => {
  const subscriber = await createRedisSubscriber();

  await subscriber.subscribe(
    VIDEO_ANALYSIS_RESULTS_CHANNEL,
    async (message) => {
      try {
        const payload = JSON.parse(message);

        const { jobId, userId, status, result, error } = payload;

        if (!jobId || !userId || !status) {
          console.error(
            "[Video Analysis Subscriber]: Invalid payload received",
            payload,
          );
          return;
        }

        console.log(
          `[Video Analysis Subscriber]: Received ${status} for job ${jobId} user ${userId}`,
        );

        if (status === "completed") {
          console.log("[Video Analysis Subscriber]: Result:", result);
        }

        if (status === "failed") {
          console.error("[Video Analysis Subscriber]: Error:", error);
        }
      } catch (e) {
        console.error(
          "[Video Analysis Subscriber]: Failed to process message:",
          e.message,
        );
      }
    },
  );

  console.log(
    `[Video Analysis Subscriber]: Subscribed to ${VIDEO_ANALYSIS_RESULTS_CHANNEL}`,
  );

  return subscriber;
};
