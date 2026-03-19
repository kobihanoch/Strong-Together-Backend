import { EnqueueAanalyzeVideoParams } from "../../types/dto/videoAnalysis.dto.ts";
import analyzeVideoQueue from "./analyzeVideoQueue.js";

// Add jobs to queue
export const enqueueAnalyzeVideo = async ({
  fileKey,
  exercise,
  userId,
}: EnqueueAanalyzeVideoParams): Promise<string> => {
  try {
    const job = await analyzeVideoQueue.add(
      {
        fileKey,
        exercise,
        userId,
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
    return String(job.id);
  } catch (e) {
    if (e instanceof Error)
      console.error(
        `[Analyze video producer]: Failed to enqueue ${userId} video: ${e.message}`,
      );
    throw e;
  }
};
