import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { RedisClientType } from 'redis';
import { appConfig } from '../../config/app.config';
import { createLogger } from '../../infrastructure/logger';
import { REDIS_SUBSCRIBER } from '../../infrastructure/redis/redis.tokens';
import { VideoAnalysisService } from './video-analysis.service';

@Injectable()
export class VideoAnalysisSubscriber implements OnModuleInit {
  private readonly videoAnalysisResultsChannel = 'video-analysis:results';
  private readonly logger = createLogger('subscriber:video-analysis', {
    channel: this.videoAnalysisResultsChannel,
  });

  constructor(
    @Inject(REDIS_SUBSCRIBER) private subscriberClient: RedisClientType,
    private readonly videoAnalysisService: VideoAnalysisService,
  ) {}

  private async handleMessage(message: string): Promise<void> {
    try {
      const payload = JSON.parse(message) as AnalyzeVideoResultPayload<SquatRepetition>;

      const { jobId, userId, status, error, requestId } = payload;

      if (!jobId || !userId || !status) {
        this.logger.error(
          { event: 'video_analysis.invalid_payload', payload },
          'Invalid video analysis payload received',
        );
        return;
      }

      const payloadLogger = this.logger.child({ jobId, userId, status, requestId });
      payloadLogger.info({ event: 'video_analysis.message_received' }, 'Video analysis result received');

      if (error) {
        payloadLogger.error({ event: 'video_analysis.processing_error', error }, 'Video analysis reported an error');
      }

      this.videoAnalysisService.emitVideoAnalysisResults(userId, payload);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(
          { err: e, event: 'video_analysis.subscription_failed' },
          'Failed to process video analysis message',
        );
      }
    }
  }

  async onModuleInit() {
    if (appConfig.isTest) {
      return;
    }

    await this.subscriberClient.subscribe(this.videoAnalysisResultsChannel, async (message: string) => {
      await this.handleMessage(message);
    });

    this.logger.info({ event: 'video_analysis.subscribed' }, 'Subscribed to video analysis results channel');
  }
}
