import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { CreateVideoUploadUrlBody, CreateVideoUploadUrlResponse } from '@strong-together/shared';
import { createVideoUploadUrlRequestSchema } from '@strong-together/shared';
import { OperationLogger } from '../../../common/application/ports/operation-logger.port';
import { CurrentRequestId } from '../../../common/decorators/current-request-id.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import { CreateVideoUploadUrlUseCase } from '../application/commands/create-video-upload-url.use-case';
import { normalizeHeaderValue } from './video-analysis.utils';

/** Video-analysis routes for authenticated users. */
@Controller('api/video-analysis/upload-urls')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class VideoAnalysisController {
  constructor(
    private readonly createVideoUploadUrlUseCase: CreateVideoUploadUrlUseCase,
    private readonly logger: OperationLogger,
  ) {}

  /**
   * Generate a presigned upload URL for a video-analysis job.
   *
   * Creates a unique file key, forwards tracing metadata into S3 object
   * metadata, and returns the upload URL the client should use for direct video
   * upload.
   *
   * API: `POST /api/video-analysis/upload-urls`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated request data.
   * @param user - The authenticated user.
   * @param requestId - The request id.
   * @param requestId - The request id.
   * @returns The response payload.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post()
  async createVideoUploadUrl(
    @RequestData(new ValidateRequestPipe(createVideoUploadUrlRequestSchema))
    data: { body: CreateVideoUploadUrlBody },
    @CurrentUser() user: AuthenticatedUser,
    @CurrentRequestId() requestId: string | undefined,
    @Req() req: Request,
  ): Promise<CreateVideoUploadUrlResponse> {
    const { exercise, fileType, jobId } = data.body;
    const userId = user.id;
    const sentryTrace = normalizeHeaderValue(req.headers['sentry-trace']);
    const baggage = normalizeHeaderValue(req.headers['baggage']);
    const { payload, fileKey } = await this.createVideoUploadUrlUseCase.execute({
      exercise,
      fileType,
      jobId,
      userId,
      ...(requestId ? { requestId } : {}),
      sentryTrace,
      baggage,
    });
    this.logger.info(
      { event: 'video_analysis.upload_url_generated', fileKey, fileType, jobId, requestId, userId },
      'Generated presigned upload URL for video analysis',
    );

    return payload;
  }
}
