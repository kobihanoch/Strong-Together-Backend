import { EnqueueAanalyzeVideoParams } from "../../types/dto/videoAnalysis.dto.ts";
import { createLogger } from "../../config/logger.ts";
import analyzeVideoQueue from "./analyzeVideoQueue.js";

const logger = createLogger('queue:analyze-video-producer', {
  queue: 'analyzeVideoQueue',
});

// Add jobs to queue
export const enqueueAnalyzeVideo = async ({
  fileKey,
  exercise,
  userId,
  requestId,
}: EnqueueAanalyzeVideoParams): Promise<string> => {
  try {
    const job = await analyzeVideoQueue.add(
      {
        fileKey,
        exercise,
        userId,
        expiresAt: Date.now() + 1000 * 60 * 60 * 12,
        ...(requestId ? { requestId } : {}),
      },
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        //removeOnFail: true,
      },
    );
    logger.info(
      { event: 'queue.job_enqueued', jobId: String(job.id), userId, exercise, fileKey, requestId },
      'Analyze video job enqueued',
    );
    return String(job.id);
  } catch (e) {
    if (e instanceof Error)
      logger.error(
        { err: e, event: 'queue.enqueue_failed', userId, exercise, fileKey, requestId },
        'Failed to enqueue analyze video job',
      );
    throw e;
  }
};
