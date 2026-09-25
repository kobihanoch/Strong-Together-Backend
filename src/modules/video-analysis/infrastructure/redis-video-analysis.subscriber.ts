import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  analyzeVideoResultPayloadDtoSchema,
  squatRepetitionDtoSchema,
  /** Represents the analyze video result payload dto value. */
  type AnalyzeVideoResultPayloadDto,
  /** Represents the squat repetition dto value. */
  type SquatRepetitionDto,
} from '@strong-together/shared';
import { RedisClientType } from 'redis';
import { appConfig } from '../../../config/app.config';
import { createLogger } from '../../../infrastructure/capabilities/observability/logger';
import { REDIS_SUBSCRIBER } from '../../../infrastructure/connections/redis/redis.tokens';
import { PublishVideoAnalysisResultUseCase } from '../application/commands/publish-video-analysis-result.use-case';

@Injectable()
export class RedisVideoAnalysisSubscriber implements OnModuleInit {
  private readonly videoAnalysisResultsChannel = 'video-analysis:results';
  private readonly logger = createLogger('subscriber:video-analysis', {
    channel: this.videoAnalysisResultsChannel,
  });

  constructor(
    @Inject(REDIS_SUBSCRIBER) private subscriberClient: RedisClientType,
    private readonly publishVideoAnalysisResultUseCase: PublishVideoAnalysisResultUseCase,
  ) {}

  private async handleMessage(message: string): Promise<void> {
    try {
      const payload: AnalyzeVideoResultPayloadDto<SquatRepetitionDto> = analyzeVideoResultPayloadDtoSchema(squatRepetitionDtoSchema).parse(
        JSON.parse(message),
      );

      const { jobId, userId, status, error, requestId } = payload;

      if (!jobId || !userId || !status) {
        this.logger.error({ event: 'video_analysis.invalid_payload', payload }, 'Invalid video analysis payload received');
        return;
      }

      const payloadLogger = this.logger.child({ jobId, userId, status, requestId });
      payloadLogger.info({ event: 'video_analysis.message_received' }, 'Video analysis result received');

      if (error) {
        payloadLogger.error({ event: 'video_analysis.processing_error', error }, 'Video analysis reported an error');
      }

      this.publishVideoAnalysisResultUseCase.execute(payload);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error({ err: e, event: 'video_analysis.subscription_failed' }, 'Failed to process video analysis message');
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
