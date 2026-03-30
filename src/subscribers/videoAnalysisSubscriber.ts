import { createRedisSubscriber } from '../config/redisClient.js';
import { createLogger } from '../config/logger.ts';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/videoAnalysis.dto.ts';
import { emitVideoAnalysisResults } from '../utils/socketUtils.ts';

const VIDEO_ANALYSIS_RESULTS_CHANNEL = 'video-analysis:results';
const logger = createLogger('subscriber:video-analysis', {
  channel: VIDEO_ANALYSIS_RESULTS_CHANNEL,
});

export const startVideoAnalysisSubscriber = async () => {
  const subscriber = await createRedisSubscriber();

  await subscriber.subscribe(VIDEO_ANALYSIS_RESULTS_CHANNEL, async (message: string) => {
    try {
      const payload = JSON.parse(message) as AnalyzeVideoResultPayload<SquatRepetition>;

      const { jobId, userId, status, error, requestId } = payload;

      if (!jobId || !userId || !status) {
        logger.error({ event: 'video_analysis.invalid_payload', payload }, 'Invalid video analysis payload received');
        return;
      }

      const payloadLogger = logger.child({ jobId, userId, status, requestId });
      payloadLogger.info({ event: 'video_analysis.message_received' }, 'Video analysis result received');

      if (error) {
        payloadLogger.error({ event: 'video_analysis.processing_error', error }, 'Video analysis reported an error');
      }

      emitVideoAnalysisResults(userId, payload, jobId);
    } catch (e) {
      if (e instanceof Error) {
        logger.error({ err: e, event: 'video_analysis.subscription_failed' }, 'Failed to process video analysis message');
      }
    }
  });

  logger.info({ event: 'video_analysis.subscribed' }, 'Subscribed to video analysis results channel');

  return subscriber;
};
