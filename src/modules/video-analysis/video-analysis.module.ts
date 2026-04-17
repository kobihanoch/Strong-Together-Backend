import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { VideoAnalysisController } from './video-analysis.controller.ts';
import { VideoAnalysisSubscriber } from './video-analysis-subscriber.ts';
import { VideoAnalysisService } from './video-analysis.service.ts';
import { AWSModule } from '../../infrastructure/aws/aws.module.ts';

@Module({
  imports: [AuthGuardsModule, AWSModule],
  controllers: [VideoAnalysisController],
  providers: [
    VideoAnalysisService,
    VideoAnalysisSubscriber,
    DpopGuard,
    RlsTxInterceptor,
  ],
})
export class VideoAnalysisModule {}
