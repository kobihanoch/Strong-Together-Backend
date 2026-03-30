import axios from 'axios';
import analyzeVideoQueue from '../src/queues/analyzeVideo/analyzeVideoQueue.ts';
import { createLogger } from '../src/config/logger.ts';

const logger = createLogger('worker:analyze-video', {
  queue: 'analyzeVideoQueue',
});

export const startAnalyzVideoWorker = async () => {
  try {
    // Try to run the worker
    analyzeVideoQueue.process(1, async (job) => {
      const { userId, fileKey, exercise } = job.data;
      const jobLogger = logger.child({ jobId: String(job.id), userId, fileKey, exercise, attempt: job.attemptsMade + 1 });
      try {
        // Skip stale jobs so the analysis service does not get flooded.
        if (job.data.expiresAt && Date.now() > job.data.expiresAt) {
          jobLogger.warn({ event: 'queue.job_expired' }, 'Skipping expired analyze video job');
          return;
        }

        const endpointUrl =
          process.env.NODE_ENV === 'development'
            ? 'http://python-service:8000/analyze-exercise'
            : process.env.ANALYSIS_SERVER_URL!;
        await axios.post(endpointUrl, {
          fileKey,
          exercise,
          jobId: String(job.id),
          userId,
        });
        jobLogger.info({ event: 'queue.job_sent', endpointUrl }, 'Analyze video job sent to analysis server');
      } catch (e) {
        if (e instanceof Error) {
          jobLogger.error({ err: e, event: 'queue.job_failed' }, 'Failed to send analyze video job to analysis server');
        }
        throw e;
      }
    });
    logger.info({ event: 'worker.started', concurrency: 1 }, 'Analyze video worker is up');
  } catch (e) {
    if (e instanceof Error) {
      logger.error({ err: e, event: 'worker.start_failed' }, 'Analyze video worker failed to start');
    }
    throw e;
  }

  return analyzeVideoQueue; // For shutdown
};
