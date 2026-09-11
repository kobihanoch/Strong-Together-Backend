import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { VideoAnalysisController } from './video-analysis.controller';
import { VideoAnalysisSubscriber } from './video-analysis-subscriber';
import { VideoAnalysisService } from './video-analysis.service';
import { AWSModule } from '../../infrastructure/aws/aws.module';

@Module({
  imports: [AWSModule],
  controllers: [VideoAnalysisController],
  providers: [
    VideoAnalysisService,
    VideoAnalysisSubscriber,
    DpopGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    RlsTxInterceptor,
  ],
})
export class VideoAnalysisModule {}
