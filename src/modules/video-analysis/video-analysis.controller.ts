import { Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import type { CreateVideoUploadUrlBody, CreateVideoUploadUrlResponse } from '@strong-together/shared';
import { createVideoUploadUrlRequestSchema } from '@strong-together/shared';
import { CurrentLogger } from '../../common/decorators/current-logger.decorator';
import { CurrentRequestId } from '../../common/decorators/current-request-id.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AppLogger } from '../../infrastructure/logger';
import type { AuthenticatedUser } from '../../common/types/express';
import { VideoAnalysisService, normalizeHeaderValue } from './video-analysis.service';

/**
 * Video-analysis routes for authenticated users.
 *
 * Preserves the existing route path and behavior from the Express version:
 * - POST /api/video-analysis/upload-urls
 *
 * Access: User
 */
@Controller('api/video-analysis/upload-urls')
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
   * @remarks Route: POST /api/video-analysis/upload-urls
   * Access: User
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param requestId - The request id.
   * @param requestLogger - The request-scoped logger.
   * @param req - The HTTP request.
   * @returns The response payload.
   */
  @Post()
  async createVideoUploadUrl(
    @RequestData(new ValidateRequestPipe(createVideoUploadUrlRequestSchema))
    data: { body: CreateVideoUploadUrlBody },
    @CurrentUser() user: AuthenticatedUser,
    @CurrentRequestId() requestId: string | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Req() req: Request,
  ): Promise<CreateVideoUploadUrlResponse> {
    const { exercise, fileType, jobId } = data.body;
    const userId = user.id;
    const sentryTrace = normalizeHeaderValue(req.headers['sentry-trace']);
    const baggage = normalizeHeaderValue(req.headers['baggage']);
    const { payload, fileKey } = await this.videoAnalysisService.createVideoUploadUrlData({
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
