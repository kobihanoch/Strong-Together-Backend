import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, HttpCode, HttpStatus, Patch, Put, UseGuards } from '@nestjs/common';
import type { GetReminderSettingsResponse, UpdateReminderTimeZoneBody, UpsertReminderSettingsBody } from '@strong-together/shared';
import { updateReminderTimeZoneRequestSchema, upsertReminderSettingsRequestSchema } from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import { GetReminderSettingsQuery } from '../application/queries/get-reminder-settings/get-reminder-settings.query';
import { UpdateReminderTimeZoneCommand } from '../application/commands/update-reminder-time-zone/update-reminder-time-zone.command';
import { UpsertReminderSettingsCommand } from '../application/commands/upsert-reminder-settings/upsert-reminder-settings.command';

/** Reminder-settings routes for authenticated users. */
@Controller('api/reminders')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class RemindersController {
  constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Gets the authenticated user's reminder settings.
   *
   * API: `GET /api/reminders`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param user - The authenticated user.
   * @returns The user's reminder settings, or null when none exist.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  async getReminderSettings(@CurrentUser() user: AuthenticatedUser): Promise<GetReminderSettingsResponse> {
    return this.queryBus.execute(new GetReminderSettingsQuery(user.id));
  }

  /**
   * Create or replace the authenticated user's reminder settings.
   *
   * Creates a settings row when none exists. Otherwise, updates the enabled
   * state, time zone, and modification timestamp of the existing row.
   *
   * API: `PUT /api/reminders`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated reminder-settings request.
   * @param user - The authenticated user.
   * @returns No body.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async upsertReminderSettings(
    @RequestData(new ValidateRequestPipe(upsertReminderSettingsRequestSchema))
    data: { body: UpsertReminderSettingsBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.commandBus.execute(new UpsertReminderSettingsCommand(user.id, data.body));
  }

  /**
   * Updates only the authenticated user's reminder time zone.
   *
   * Leaves the reminder-enabled setting unchanged.
   *
   * API: `PATCH /api/reminders/time-zone`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated reminder time-zone request.
   * @param user - The authenticated user.
   * @returns No body.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Patch('time-zone')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateReminderTimeZone(
    @RequestData(new ValidateRequestPipe(updateReminderTimeZoneRequestSchema))
    data: { body: UpdateReminderTimeZoneBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateReminderTimeZoneCommand(user.id, data.body));
  }
}
