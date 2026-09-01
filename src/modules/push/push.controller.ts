import { Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentLogger } from '../../common/decorators/current-logger.decorator';
import { CurrentRequestId } from '../../common/decorators/current-request-id.decorator';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import type { AppLogger } from '../../infrastructure/logger';
import { PushService } from './push.service';

/**
 * Push-notification trigger routes.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - POST /api/push-jobs/daily
 * - POST /api/push-jobs/hourly-reminders
 *
 * Access: Public
 */
@Controller('api/push-jobs')
@UseInterceptors(RlsTxInterceptor)
export class PushController {
  constructor(private readonly pushService: PushService) {}

  /**
   * Enqueue the daily push-notification batch.
   *
   * Triggers the daily notification flow and returns a summary of the enqueue
   * operation.
   *
   * @remarks Route: POST /api/push-jobs/daily
   * Access: Public
   *
   * @param requestId - The request id.
   * @param requestLogger - The request-scoped logger.
   * @param res - The HTTP response.
   */
  @Post('daily')
  async sendDailyPush(
    @CurrentRequestId() requestId: string | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const payload = await this.pushService.sendDailyPushData(requestId);
      res.json({ success: payload.success, message: payload.message });
    } catch (error) {
      if (error instanceof Error) {
        requestLogger.error({ err: error, event: 'push.daily_enqueue_failed' }, 'Failed to enqueue daily notifications');
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }

  /**
   * Enqueue the hourly workout-reminder push batch.
   *
   * Calculates per-user reminder timing and enqueues reminder notifications for
   * users whose next workout reminder is due.
   *
   * @remarks Route: POST /api/push-jobs/hourly-reminders
   * Access: Public
   *
   * @param requestId - The request id.
   * @param requestLogger - The request-scoped logger.
   * @param res - The HTTP response.
   */
  @Post('hourly-reminders')
  async sendHourlyReminderPush(
    @CurrentRequestId() requestId: string | undefined,
    @CurrentLogger() requestLogger: AppLogger,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const payload = await this.pushService.sendHourlyReminderPushData(requestId);
      res.json({
        success: payload.success,
        message: payload.message,
      });
    } catch (error) {
      if (error instanceof Error) {
        requestLogger.error({ err: error, event: 'push.hourly_enqueue_failed' }, 'Failed to enqueue hourly reminders');
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
