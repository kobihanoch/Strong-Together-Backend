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
import { InviteCrewUserUseCase } from '../application/use-cases/invite-crew-user.use-case';
import { ListCrewInvitationsUseCase } from '../application/use-cases/list-crew-invitations.use-case';
import { ListPendingCrewJoinRequestsUseCase } from '../application/use-cases/list-pending-crew-join-requests.use-case';
import { RequestToJoinCrewUseCase } from '../application/use-cases/request-to-join-crew.use-case';
import { UpdateCrewParticipationRequestUseCase } from '../application/use-cases/update-crew-participation-request.use-case';

/**
 * Exposes authenticated endpoints for creating and resolving crew participation requests.
 *
 * Routes:
 * - `POST /api/social/crews/:crewId/invitations`
 * - `POST /api/social/crews/:crewId/join-requests`
 * - `GET /api/social/crews/invitations`
 * - `GET /api/social/crews/:crewId/join-requests`
 * - `PATCH /api/social/crews/participation-requests/:requestId`
 *
 * @remarks
 * Every request passes DPoP validation, authentication, user-role authorization,
 * request validation, and the RLS transaction interceptor. PostgreSQL RLS makes
 * the final authorization decision for the affected crew or request row.
 *
 * Authorized application role: `user`.
 */
@Controller('api/social/crews')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@Roles('user')
export class CrewRequestsController {
  public constructor(
    private readonly inviteCrewUser: InviteCrewUserUseCase,
    private readonly requestCrewMembership: RequestToJoinCrewUseCase,
    private readonly listCrewInvitations: ListCrewInvitationsUseCase,
    private readonly listPendingRequests: ListPendingCrewJoinRequestsUseCase,
    private readonly updateParticipationRequest: UpdateCrewParticipationRequestUseCase,
  ) {}

  /**
   * Creates a pending invitation for a user to join a crew.
   *
   * @remarks
   * API: POST /api/social/crews/:crewId/invitations
   * Access: Authenticated user
   * The authenticated user becomes the invitation initiator. RLS requires the
   * caller to be the active leader of the target crew.
   *
   * Authorized application role: `user`.
   * Authorized crew role: active `leader`.
   *
   * @param data - The validated crew identifier and invited-user identifier.
   * @param user - The authenticated user who initiates the invitation.
   * @returns No response body with a `201 Created` status.
   * @throws {CrewNotFoundError} When no permitted target crew is visible.
   */
  @Post(':crewId/invitations')
  @HttpCode(HttpStatus.CREATED)
  async inviteUser(
    @RequestData(new ValidateRequestPipe(inviteCrewUserRequestSchema))
    data: { params: InviteCrewUserParams; body: InviteCrewUserBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InviteCrewUserResponse> {
    await this.inviteCrewUser.execute(data.params.crewId, user.id, data.body.userId);
  }

  /**
   * Requests membership in a crew for the authenticated user.
   *
   * @remarks
   * API: POST /api/social/crews/:crewId/join-requests
   * Access: Authenticated user
   * Public crews accept the request immediately and create membership. Private
   * crews retain a pending request for an authorized crew leader to resolve.
   *
   * Authorized application role: `user`.
   * Authorized crew role: none; the user requests membership for themself.
   *
   * @param data - The validated target crew identifier.
   * @param user - The authenticated user requesting membership.
   * @returns No response body with a `201 Created` status.
   * @throws {CrewNotFoundError} When no permitted target crew is visible.
   */
  @Post(':crewId/join-requests')
  @HttpCode(HttpStatus.CREATED)
  async requestToJoin(
    @RequestData(new ValidateRequestPipe(requestToJoinCrewRequestSchema)) data: { params: RequestToJoinCrewParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<RequestToJoinCrewResponse> {
    await this.requestCrewMembership.execute(data.params.crewId, user.id);
  }

  /**
   * Lists every crew invitation addressed to the authenticated user.
   *
   * @remarks
   * API: GET /api/social/crews/invitations
   * Access: Authenticated user
   * The response includes the user's pending and previously resolved invitations.
   *
   * Authorized application role: `user`.
   * Authorized crew role: none; users can read invitations addressed to themselves.
   *
   * @returns All invitations visible to the authenticated user.
   */
  @Get('invitations')
  async listInvitations(): Promise<ListCrewInvitationsResponse> {
    return this.listCrewInvitations.execute();
  }

  /**
   * Lists pending user join requests for a crew.
   *
   * @remarks
   * API: GET /api/social/crews/:crewId/join-requests
   * Access: Authenticated user
   * Invitations are excluded; only pending self-initiated join requests are returned.
   *
   * Authorized application role: `user`.
   * Authorized crew role: active `leader`.
   *
   * @param data - The validated target crew identifier.
   * @returns Pending join requests for the crew.
   */
  @Get(':crewId/join-requests')
  async listPendingJoinRequests(
    @RequestData(new ValidateRequestPipe(listPendingCrewJoinRequestsRequestSchema))
    data: {
      params: ListPendingCrewJoinRequestsParams;
    },
  ): Promise<ListPendingCrewJoinRequestsResponse> {
    return this.listPendingRequests.execute(data.params.crewId);
  }

  /**
   * Accepts or declines a pending crew participation request.
   *
   * @remarks
   * API: PATCH /api/social/crews/participation-requests/:requestId
   * Access: Authenticated user
   * A crew leader may resolve a join request, while the invited user may resolve
   * an invitation. Accepting creates active membership; declining does not.
   * RLS enforces both responder authorization and the pending-state transition.
   *
   * Authorized application role: `user`.
   * Authorized crew roles: active `leader` for join requests; no crew role for
   * an invited user responding to their own invitation.
   *
   * @param data - The validated request identifier and terminal status.
   * @returns No response body with a `204 No Content` status.
   * @throws {ParticipationRequestNotFoundError} When the request is absent, no longer pending, or inaccessible to the caller.
   */
  @Patch('participation-requests/:requestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStatus(
    @RequestData(new ValidateRequestPipe(updateCrewParticipationRequestStatusRequestSchema))
    data: {
      params: UpdateCrewParticipationRequestStatusParams;
      body: UpdateCrewParticipationRequestStatusBody;
    },
  ): Promise<UpdateCrewParticipationRequestStatusResponse> {
    await this.updateParticipationRequest.execute(data.params.requestId, data.body.status);
  }
}
