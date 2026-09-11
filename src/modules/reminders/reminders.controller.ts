import { Controller, Get, HttpCode, HttpStatus, Patch, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  GetReminderSettingsResponse,
  UpdateReminderTimeZoneBody,
  UpsertReminderSettingsBody,
} from '@strong-together/shared';
import { updateReminderTimeZoneRequestSchema, upsertReminderSettingsRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequestData } from '../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../common/guards/authorization.guard';
import { DpopGuard } from '../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../common/types/express';
import { RemindersService } from './reminders.service';

/**
 * Reminder-settings routes for authenticated users.
 *
 * Exposes reminder-settings read and create-or-replace operations:
 * - GET /api/reminders
 * - PUT /api/reminders
 * - PATCH /api/reminders/time-zone
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
   * Gets the authenticated user's reminder settings.
   * @remarks Route: GET /api/reminders
   * Access: User
   * @param user - The authenticated user.
   * @returns The user's reminder settings, or null when none exist.
   */
  @Get()
  async getReminderSettings(@CurrentUser() user: AuthenticatedUser): Promise<GetReminderSettingsResponse> {
    return this.remindersService.getReminderSettingsData(user.id);
  }

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

  /**
   * Updates only the authenticated user's reminder time zone.
   *
   * Leaves the reminder-enabled setting unchanged.
   *
   * @remarks Route: PATCH /api/reminders/time-zone
   * Access: User
   *
   * @param data - The validated reminder time-zone request.
   * @param user - The authenticated user.
   */
  @Patch('time-zone')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateReminderTimeZone(
    @RequestData(new ValidateRequestPipe(updateReminderTimeZoneRequestSchema))
    data: { body: UpdateReminderTimeZoneBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.remindersService.updateReminderTimeZoneData(user.id, data.body);
  }
}
