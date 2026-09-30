import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import type {
  InviteCrewUserBody,
  InviteCrewUserParams,
  InviteCrewUserResponse,
  ListCrewInvitationsResponse,
  ListPendingCrewJoinRequestsParams,
  ListPendingCrewJoinRequestsResponse,
  RequestToJoinCrewParams,
  RequestToJoinCrewResponse,
  UpdateCrewParticipationRequestStatusBody,
  UpdateCrewParticipationRequestStatusParams,
  UpdateCrewParticipationRequestStatusResponse,
} from '@strong-together/shared';
import {
  inviteCrewUserRequestSchema,
  listPendingCrewJoinRequestsRequestSchema,
  requestToJoinCrewRequestSchema,
  updateCrewParticipationRequestStatusRequestSchema,
} from '@strong-together/shared';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../../common/guards/dpop-validation.guard';
import { ValidateRequestPipe } from '../../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../../common/types/express';
import { InviteCrewUserCommand } from '../application/commands/invite-crew-user/invite-crew-user.command';
import { ListCrewInvitationsQuery } from '../application/queries/list-crew-invitations/list-crew-invitations.query';
import { ListPendingCrewJoinRequestsQuery } from '../application/queries/list-pending-crew-join-requests/list-pending-crew-join-requests.query';
import { RequestToJoinCrewCommand } from '../application/commands/request-to-join-crew/request-to-join-crew.command';
import { UpdateCrewParticipationRequestCommand } from '../application/commands/update-crew-participation-request/update-crew-participation-request.command';

/** Exposes authenticated endpoints for creating and resolving crew participation requests. */
@Controller('api/social/crews')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class CrewRequestsController {
  public constructor(private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Creates a pending invitation for a user to join a crew.
   *
   * API: `POST /api/social/crews/:crewId/invitations`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated crew identifier and invited-user identifier.
   * @param user - The authenticated user who initiates the invitation.
   * @returns No response body with a `201 Created` status.
   * @throws {CrewNotFoundError} When no permitted target crew is visible.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post(':crewId/invitations')
  @HttpCode(HttpStatus.CREATED)
  async inviteUser(
    @RequestData(new ValidateRequestPipe(inviteCrewUserRequestSchema))
    data: { params: InviteCrewUserParams; body: InviteCrewUserBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InviteCrewUserResponse> {
    await this.commandBus.execute(new InviteCrewUserCommand(data.params.crewId, user.id, data.body.userId));
  }

  /**
   * Requests membership in a crew for the authenticated user.
   *
   * API: `POST /api/social/crews/:crewId/join-requests`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated target crew identifier.
   * @param user - The authenticated user requesting membership.
   * @returns No response body with a `201 Created` status.
   * @throws {CrewNotFoundError} When no permitted target crew is visible.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post(':crewId/join-requests')
  @HttpCode(HttpStatus.CREATED)
  async requestToJoin(
    @RequestData(new ValidateRequestPipe(requestToJoinCrewRequestSchema)) data: { params: RequestToJoinCrewParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<RequestToJoinCrewResponse> {
    await this.commandBus.execute(new RequestToJoinCrewCommand(data.params.crewId, user.id));
  }

  /**
   * Lists every crew invitation addressed to the authenticated user.
   *
   * API: `GET /api/social/crews/invitations`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @returns All invitations visible to the authenticated user.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('invitations')
  async listInvitations(@CurrentUser() user: AuthenticatedUser): Promise<ListCrewInvitationsResponse> {
    return this.queryBus.execute(new ListCrewInvitationsQuery(user.id));
  }

  /**
   * Lists pending user join requests for a crew.
   *
   * API: `GET /api/social/crews/:crewId/join-requests`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated target crew identifier.
   * @returns Pending join requests for the crew.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get(':crewId/join-requests')
  async listPendingJoinRequests(
    @RequestData(new ValidateRequestPipe(listPendingCrewJoinRequestsRequestSchema))
    data: {
      params: ListPendingCrewJoinRequestsParams;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListPendingCrewJoinRequestsResponse> {
    return this.queryBus.execute(new ListPendingCrewJoinRequestsQuery(user.id, data.params.crewId));
  }

  /**
   * Accepts or declines a pending crew participation request.
   *
   * API: `PATCH /api/social/crews/participation-requests/:requestId`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated request identifier and terminal status.
   * @returns No response body with a `204 No Content` status.
   * @throws {ParticipationRequestNotFoundError} When the request is absent, no longer pending, or inaccessible to the caller.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Patch('participation-requests/:requestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @RequestData(new ValidateRequestPipe(updateCrewParticipationRequestStatusRequestSchema))
    data: {
      params: UpdateCrewParticipationRequestStatusParams;
      body: UpdateCrewParticipationRequestStatusBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UpdateCrewParticipationRequestStatusResponse> {
    await this.commandBus.execute(new UpdateCrewParticipationRequestCommand(user.id, data.params.requestId, data.body.status));
  }
}
