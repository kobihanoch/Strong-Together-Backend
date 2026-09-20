import { Controller, Headers, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { extractBearerToken } from '../../../common/authentication/authentication.utils';
import { CurrentRequestId } from '../../../common/decorators/current-request-id.decorator';
import { authConfig } from '../../../config/auth.config';
import type { PushBatchResult } from '../application/models/push.models';
import { EnqueueDueWorkoutRemindersUseCase } from '../application/use-cases/enqueue-due-workout-reminders.use-case';

/**
 * Push-notification trigger routes.
 *
 * - POST /api/push-jobs/workout-reminders
 *
 * Access: Cron JWT
 */
@Controller('api/push-jobs')
export class PushController {
  constructor(private readonly enqueueDueWorkoutRemindersUseCase: EnqueueDueWorkoutRemindersUseCase) {}

  /**
   * Enqueues workout reminders due during the cron look-ahead window.
   *
   * API: POST /api/push-jobs/workout-reminders
   * Access: Cron JWT
   *
   * @param authorization - Bearer JWT supplied by the cron service.
   * @param requestId - The request id.
   * @returns The enqueue result and number of reminders found.
   * @throws {UnauthorizedException} When the cron JWT is missing or invalid.
   */
  @Post('workout-reminders')
  @HttpCode(HttpStatus.OK)
  async enqueueWorkoutReminders(
    @Headers('authorization') authorization: string | undefined,
    @CurrentRequestId() requestId: string | undefined,
  ): Promise<PushBatchResult> {
    const token = extractBearerToken(authorization);
    try {
      if (!token || !authConfig.cronJwtSecret) throw new Error('Missing cron JWT');
      jwt.verify(token, authConfig.cronJwtSecret, { algorithms: ['HS256'] });
    } catch {
      throw new UnauthorizedException('Invalid cron JWT');
    }

    return this.enqueueDueWorkoutRemindersUseCase.execute(requestId);
  }
}
