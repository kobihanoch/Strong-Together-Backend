import { Module } from '@nestjs/common';
import { AuthenticationGuard } from '../../common/guards/authentication.guard.ts';
import { AuthorizationGuard } from '../../common/guards/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { VideoAnalysisController } from './video-analysis.controller.ts';
import { VideoAnalysisSubscriber } from './video-analysis-subscriber.ts';
import { VideoAnalysisService } from './video-analysis.service.ts';

@Module({
  controllers: [VideoAnalysisController],
  providers: [VideoAnalysisService, VideoAnalysisSubscriber, DpopGuard, AuthenticationGuard, AuthorizationGuard, RlsTxInterceptor],
})
export class VideoAnalysisModule {}
