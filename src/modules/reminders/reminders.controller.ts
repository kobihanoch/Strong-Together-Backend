import { Controller, HttpCode, HttpStatus, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import type { UpsertReminderSettingsBody } from '@strong-together/shared';
import { upsertReminderSettingsRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/auth/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../common/types/express';
import { RemindersService } from './reminders.service';

/**
 * Reminder-settings routes for authenticated users.
 *
 * Exposes a single create-or-replace operation:
 * - PUT /api/reminders
 *
 * Access: User
 */
@Controller('api/reminders')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  /**
   * Create or replace the authenticated user's reminder settings.
   *
   * Creates a settings row when none exists. Otherwise, updates the enabled
   * state, time zone, and modification timestamp of the existing row.
   *
   * @remarks Route: PUT /api/reminders
   * Access: User
   *
   * @param data - The validated reminder-settings request.
   * @param user - The authenticated user.
   */
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async upsertReminderSettings(
    @RequestData(new ValidateRequestPipe(upsertReminderSettingsRequestSchema))
    data: { body: UpsertReminderSettingsBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.remindersService.upsertReminderSettingsData(user.id, data.body);
  }
}
