import analyzeVideoQueue from "./analyzeVideoQueue.js";

// Add jobs to queue
export const enqueueAnalyzeVideo = async (fileKey, exercise, userId) => {
  try {
    const jobId = crypto.randomUUID();
    await analyzeVideoQueue.add(
      {
        fileKey,
        exercise,
        userId,
        jobId,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12,
      },
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        //removeOnFail: true,
      },
    );
    console.log(`[Analyze video producer]: Enqueued ${userId} video`);
    return jobId;
  } catch (e) {
    console.error(
      `[Analyze video producer]: Failed to enqueue ${userId} video: ${e.message}`,
    );
    throw e;
  }
};
