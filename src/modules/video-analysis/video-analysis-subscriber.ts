import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { appConfig } from '../../config/app.config.ts';
import { closeRedisSubscriber, createRedisSubscriber } from '../../infrastructure/redis.client.ts';
import { createLogger } from '../../infrastructure/logger.ts';
import { VideoAnalysisService } from './video-analysis.service.ts';

@Injectable()
export class VideoAnalysisSubscriber implements OnModuleInit, OnModuleDestroy {
  private readonly videoAnalysisResultsChannel = 'video-analysis:results';
  private readonly logger = createLogger('subscriber:video-analysis', {
    channel: this.videoAnalysisResultsChannel,
  });
  private subscriberClient: Awaited<ReturnType<typeof createRedisSubscriber>> | null = null;

  constructor(private readonly videoAnalysisService: VideoAnalysisService) {}

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

    const subscriberClient = await createRedisSubscriber();
    this.subscriberClient = subscriberClient;

    await subscriberClient.subscribe(this.videoAnalysisResultsChannel, async (message: string) => {
      await this.handleMessage(message);
    });

    this.logger.info({ event: 'video_analysis.subscribed' }, 'Subscribed to video analysis results channel');
  }

  async onModuleDestroy() {
    if (this.subscriberClient) {
      await closeRedisSubscriber(this.subscriberClient);
    }
  }
}
