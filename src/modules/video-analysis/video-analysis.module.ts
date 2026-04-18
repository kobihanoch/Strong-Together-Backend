import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../../common/guards/auth/auth-guards.module';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { VideoAnalysisController } from './video-analysis.controller';
import { VideoAnalysisSubscriber } from './video-analysis-subscriber';
import { VideoAnalysisService } from './video-analysis.service';
import { AWSModule } from '../../infrastructure/aws/aws.module';

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
