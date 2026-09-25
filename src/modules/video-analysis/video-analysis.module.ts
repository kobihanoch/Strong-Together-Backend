import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { AWSModule } from '../../infrastructure/connections/aws/aws.module';
import { VideoAnalysisPublisher } from './application/ports/video-analysis-publisher.port';
import { VideoAnalysisTelemetry } from './application/ports/video-analysis-telemetry.port';
import { VideoStorage } from './application/ports/video-storage.port';
import { CreateVideoUploadUrlUseCase } from './application/commands/create-video-upload-url.use-case';
import { PublishVideoAnalysisResultUseCase } from './application/commands/publish-video-analysis-result.use-case';
import { RedisVideoAnalysisSubscriber } from './infrastructure/redis-video-analysis.subscriber';
import { S3VideoStorage } from './infrastructure/s3-video.storage';
import { SentryVideoAnalysisTelemetry } from './infrastructure/sentry-video-analysis.telemetry';
import { SocketVideoAnalysisPublisher } from './infrastructure/socket-video-analysis.publisher';
import { VideoAnalysisController } from './presentation/video-analysis.controller';

@Module({
  imports: [AWSModule],
  controllers: [VideoAnalysisController],
  providers: [
    { provide: VideoStorage, useClass: S3VideoStorage },
    { provide: VideoAnalysisPublisher, useClass: SocketVideoAnalysisPublisher },
    { provide: VideoAnalysisTelemetry, useClass: SentryVideoAnalysisTelemetry },
    CreateVideoUploadUrlUseCase,
    PublishVideoAnalysisResultUseCase,
    RedisVideoAnalysisSubscriber,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
  ],
})
export class VideoAnalysisModule {}
