import axios from "axios";
import analyzeVideoQueue from "../src/queues/analyzeVideo/analyzeVideoQueue.js";

export const startAnalyzVideoWorker = async () => {
  try {
    // Try to run the worker
    analyzeVideoQueue.process(1, async (job) => {
      const { userId, fileKey, exercise } = job.data;
      try {
        // Skip stale jobs so the analysis service does not get flooded.
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          console.log(`Skipping expired analyze video for user ${userId}`);
          return;
        }

        const endpointUrl =
          process.env.NODE_ENV === "development"
            ? "http://python-service:8000/analyze-exercise"
            : process.env.ANALYSIS_SERVER_URL;
        await axios.post(endpointUrl, {
          fileKey,
          exercise,
          jobId: String(job.id),
          userId,
        });
        console.log(
          `[Analyze video worker]: User ${userId} video has been sent to server`,
        );
      } catch (e) {
        console.error(
          `[Analyze video worker]: Failed to send user ${userId} video to server: ${e.message}`,
        );
        throw e;
      }
    });
    console.log("[Analyze video worker]: Analyze video worker is up");
  } catch (e) {
    console.error(
      "[Analyze video worker]: Analyze video worker failed to start:",
      e.message,
    );
    throw e;
  }

  return analyzeVideoQueue; // For shutdown
};
