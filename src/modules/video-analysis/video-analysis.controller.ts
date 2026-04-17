import { Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import type { GetPresignedUrlFromS3Body, GetPresignedUrlFromS3Response } from '@strong-together/shared';
import { getPresignedUrlS3Request } from '@strong-together/shared';
import { CurrentLogger } from '../../common/decorators/current-logger.decorator.ts';
import { CurrentRequestId } from '../../common/decorators/current-request-id.decorator.ts';
import { CurrentUser } from '../../common/decorators/current-user.decorator.ts';
import { RequestData } from '../../common/decorators/request-data.decorator.ts';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard.ts';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard.ts';
import { DpopGuard } from '../../common/guards/dpop-validation.guard.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe.ts';
import type { AppLogger } from '../../infrastructure/logger.ts';
import type { AuthenticatedUser } from '../../common/types/express.ts';
import { VideoAnalysisService, normalizeHeaderValue } from './video-analysis.service.ts';

/**
 * Video-analysis routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/videoanalysis/getpresignedurl
 *
 * Access: User
 */
@Controller('api/videoanalysis')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class VideoAnalysisController {
  constructor(private readonly videoAnalysisService: VideoAnalysisService) {}

  /**
   * Generate a presigned upload URL for a video-analysis job.
   *
   * Creates a unique file key, forwards tracing metadata into S3 object
   * metadata, and returns the upload URL the client should use for direct video
   * upload.
   *
   * Route: POST /api/videoanalysis/getpresignedurl
   * Access: User
   */
  @Post('getpresignedurl')
  async getPresignedUrlFromS3(
    @RequestData(new ValidateRequestPipe(getPresignedUrlS3Request))
    data: { body: GetPresignedUrlFromS3Body },
    @CurrentUser() user: AuthenticatedUser,
    @CurrentRequestId() requestId: string | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Req() req: Request,
  ): Promise<GetPresignedUrlFromS3Response> {
    const { exercise, fileType, jobId } = data.body;
    const userId = user.id;
    const sentryTrace = normalizeHeaderValue(req.headers['sentry-trace']);
    const baggage = normalizeHeaderValue(req.headers['baggage']);
    const { payload, fileKey } = await this.videoAnalysisService.getPresignedUrlData({
      exercise,
      fileType,
      jobId,
      userId,
      ...(requestId ? { requestId } : {}),
      sentryTrace,
      baggage,
    });
    requestLogger.info(
      { event: 'video_analysis.upload_url_generated', fileKey, fileType, jobId, requestId, userId },
      'Generated presigned upload URL for video analysis',
    );

    return payload;
  }
}
