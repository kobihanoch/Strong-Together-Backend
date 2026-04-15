import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentLogger } from '../../common/decorators/current-logger.decorator.ts';
import { CurrentRequestId } from '../../common/decorators/current-request-id.decorator.ts';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor.ts';
import type { AppLogger } from '../../infrastructure/logger.ts';
import { PushService } from './push.service.ts';

/**
 * Push-notification trigger routes.
 *
 * Preserves the existing route paths and behavior from the Express version:
 * - GET /api/push/daily
 * - GET /api/push/hourlyreminder
 *
 * Access: Public
 */
@Controller('api/push')
@UseInterceptors(RlsTxInterceptor)
export class PushController {
  constructor(private readonly pushService: PushService) {}

  /**
   * Enqueue the daily push-notification batch.
   *
   * Triggers the daily notification flow and returns a summary of the enqueue
   * operation.
   *
   * Route: GET /api/push/daily
   * Access: Public
   */
  @Get('daily')
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
        requestLogger.error(
          { err: error, event: 'push.daily_enqueue_failed' },
          'Failed to enqueue daily notifications',
        );
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
   * Route: GET /api/push/hourlyreminder
   * Access: Public
   */
  @Get('hourlyreminder')
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
        requestLogger.error(
          { err: error, event: 'push.hourly_enqueue_failed' },
          'Failed to enqueue hourly reminders',
        );
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
}
