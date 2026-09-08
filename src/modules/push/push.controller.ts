import { Controller, Headers, Post, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import { extractBearerToken } from '../../common/authentication/authentication.utils';
import { CurrentLogger } from '../../common/decorators/current-logger.decorator';
import { CurrentRequestId } from '../../common/decorators/current-request-id.decorator';
import { authConfig } from '../../config/auth.config';
import type { AppLogger } from '../../infrastructure/logger';
import { PushService } from './push.service';

/**
 * Push-notification trigger routes.
 *
 * - POST /api/push-jobs/workout-reminders
 *
 * Access: Cron JWT
 */
@Controller('api/push-jobs')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  /**
   * Enqueues workout reminders due during the cron look-ahead window.
   *
   * @remarks Route: POST /api/push-jobs/workout-reminders
   * Access: Cron JWT
   *
   * @param authorization - Bearer JWT supplied by the cron service.
   * @param requestId - The request id.
   * @param requestLogger - The request-scoped logger.
   * @param res - The HTTP response.
   * @returns Resolves after due reminders are enqueued and the response is sent.
   */
  @Post('workout-reminders')
  async enqueueWorkoutReminders(
    @Headers('authorization') authorization: string | undefined,
    @CurrentRequestId() requestId: string | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Res() res: Response,
  ): Promise<void> {
    const token = extractBearerToken(authorization);
    try {
      if (!token || !authConfig.cronJwtSecret) throw new Error('Missing cron JWT');
      jwt.verify(token, authConfig.cronJwtSecret, { algorithms: ['HS256'] });
    } catch {
      throw new UnauthorizedException('Invalid cron JWT');
    }

    try {
      const payload = await this.pushService.enqueueDueWorkoutReminders(requestId);
      res.status(200).json(payload);
    } catch (error) {
      if (error instanceof Error) {
        requestLogger.error(
          { err: error, event: 'push.workout_reminders_enqueue_failed' },
          'Failed to enqueue workout reminders',
        );
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
