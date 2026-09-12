import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import type {
  CreateCrewBody,
  CreateCrewResponse,
  DeleteCrewParams,
  GetCrewParams,
  GetCrewResponse,
  ListCrewsQuery,
  ListCrewsResponse,
  ListCrewParticipantsParams,
  ListCrewParticipantsQuery,
  ListCrewParticipantsResponse,
  LeaveCrewParams,
  LeaveCrewResponse,
  UpdateCrewBody,
  UpdateCrewParams,
  UpdateCrewResponse,
  InviteCrewUserBody,
  InviteCrewUserParams,
  InviteCrewUserResponse,
  RequestToJoinCrewParams,
  RequestToJoinCrewResponse,
  AcceptCrewJoinRequestParams,
  AcceptCrewJoinRequestResponse,
  AcceptCrewInvitationParams,
  AcceptCrewInvitationResponse,
} from '@strong-together/shared';
import {
  createCrewRequestSchema,
  deleteCrewRequestSchema,
  getCrewRequestSchema,
  listCrewsRequestSchema,
  listCrewParticipantsRequestSchema,
  leaveCrewRequestSchema,
  updateCrewRequestSchema,
  inviteCrewUserRequestSchema,
  requestToJoinCrewRequestSchema,
  acceptCrewJoinRequestRequestSchema,
  acceptCrewInvitationRequestSchema,
} from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { RlsTxInterceptor } from '../../../common/interceptors/rls-tx.interceptor';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import { CrewsService } from './crews.service';

/**
 * Exposes authenticated CRUD endpoints for crews.
 *
 * Routes:
 * - GET /api/social/crews
 * - GET /api/social/crews/:id
 * - GET /api/social/crews/:crewId/participants
 * - POST /api/social/crews
 * - PATCH /api/social/crews/:id
 * - POST /api/social/crews/:id/leave
 * - DELETE /api/social/crews/:id
 *
 * @remarks Every request passes DPoP, authentication, authorization, and the
 * RLS transaction interceptor before reaching the service layer.
 * Access: User
 */
@Controller('api/social/crews')
@UseGuards(DpopGuard, AuthenticationGuard, AuthorizationGuard)
@UseInterceptors(RlsTxInterceptor)
@Roles('user')
export class CrewsController {
  constructor(private readonly service: CrewsService) {}

  /**
   * Lists the crews visible to the authenticated user.
   *
   * @remarks Route: GET /api/social/crews
   * Access: User
   *
   * @param data - The validated pagination query.
   * @returns The RLS-filtered crew collection.
   */
  @Get()
  async list(
    @RequestData(new ValidateRequestPipe(listCrewsRequestSchema))
    data: {
      query: ListCrewsQuery;
    },
  ): Promise<ListCrewsResponse> {
    return this.service.listCrewsData(data.query.limit, data.query.cursor);
  }

  /**
   * Lists active participants of an accessible crew.
   * Public crews expose participants to every authenticated user. Private crews
   * expose participants only to active members.
   *
   * @remarks Route: GET /api/social/crews/:crewId/participants
   * Access: User
   *
   * @param data - The validated crew identifier and pagination query.
   * @returns The paginated active participant collection.
   */
  @Get(':crewId/participants')
  async listParticipants(
    @RequestData(new ValidateRequestPipe(listCrewParticipantsRequestSchema))
    data: {
      params: ListCrewParticipantsParams;
      query: ListCrewParticipantsQuery;
    },
  ): Promise<ListCrewParticipantsResponse> {
    return this.service.listCrewParticipantsData(data.params.crewId, data.query.limit, data.query.cursor);
  }

  /**
   * Gets a crew by its UUID.
   *
   * @remarks Route: GET /api/social/crews/:id
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns The requested crew when it is visible to the caller.
   * @throws NotFoundException when no visible crew has the supplied UUID.
   */
  @Get(':id')
  async get(
    @RequestData(new ValidateRequestPipe(getCrewRequestSchema))
    data: {
      params: GetCrewParams;
    },
  ): Promise<GetCrewResponse> {
    return this.service.getCrewData(data.params.id);
  }

  /**
   * Creates a crew led by the authenticated user.
   *
   * @remarks Route: POST /api/social/crews
   * Access: User
   *
   * @param data - The validated crew creation body.
   * @param user - The authenticated user supplied by the authentication guard.
   * @returns No response body with a 201 Created status.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @RequestData(new ValidateRequestPipe(createCrewRequestSchema))
    data: { body: CreateCrewBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreateCrewResponse> {
    await this.service.createCrewData(user.id, data.body);
  }

  /**
   * Updates a crew that the authenticated user is allowed to manage.
   *
   * @remarks Route: PATCH /api/social/crews/:id
   * Access: User
   *
   * @param data - The validated route parameters and update body.
   * @returns No response body with a 204 No Content status.
   * @throws NotFoundException when RLS exposes no matching crew.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @RequestData(new ValidateRequestPipe(updateCrewRequestSchema))
    data: {
      params: UpdateCrewParams;
      body: UpdateCrewBody;
    },
  ): Promise<UpdateCrewResponse> {
    await this.service.updateCrewData(data.params.id, data.body);
  }

  /**
   * Leaves an active crew membership.
   *
   * @remarks Route: POST /api/social/crews/:id/leave
   * Access: User
   *
   * A regular member is marked as left. When the caller is the leader,
   * leadership first transfers to participant number two using the established
   * participant ordering.
   *
   * @param data - The validated crew identifier.
   * @returns No response body with a 204 No Content status.
   * @throws NotFoundException when the caller is not an active member.
   * When the leader is the crew's final active member, leaving deletes the crew.
   */
  @Post(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @RequestData(new ValidateRequestPipe(leaveCrewRequestSchema))
    data: {
      params: LeaveCrewParams;
    },
  ): Promise<LeaveCrewResponse> {
    await this.service.leaveCrewData(data.params.id);
  }

  /**
   * Deletes a crew that the authenticated user is allowed to manage.
   *
   * @remarks Route: DELETE /api/social/crews/:id
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns No response body.
   * @throws NotFoundException when RLS exposes no matching crew.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @RequestData(new ValidateRequestPipe(deleteCrewRequestSchema))
    data: {
      params: DeleteCrewParams;
    },
  ): Promise<void> {
    await this.service.deleteCrewData(data.params.id);
  }

  /**
   * Invites a user to a crew.
   *
   * @remarks Route: POST /api/social/crews/:crewId/invitations. RLS requires crew management access.
   * @param data - The crew UUID and invited user UUID.
   * @param user - The authenticated invitation initiator.
   * @returns No response body.
   */
  @Post(':crewId/invitations')
  @HttpCode(HttpStatus.CREATED)
  async inviteUser(
    @RequestData(new ValidateRequestPipe(inviteCrewUserRequestSchema))
    data: { params: InviteCrewUserParams; body: InviteCrewUserBody },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<InviteCrewUserResponse> {
    await this.service.inviteUserData(data.params.crewId, user.id, data.body.userId);
  }

  /**
   * Requests membership in a crew.
   *
   * @remarks Route: POST /api/social/crews/:crewId/join-requests. Public crews join immediately.
   * @param data - The crew UUID.
   * @param user - The authenticated requester.
   * @returns No response body.
   */
  @Post(':crewId/join-requests')
  @HttpCode(HttpStatus.CREATED)
  async requestToJoin(
    @RequestData(new ValidateRequestPipe(requestToJoinCrewRequestSchema)) data: { params: RequestToJoinCrewParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<RequestToJoinCrewResponse> {
    await this.service.requestToJoinData(data.params.crewId, user.id);
  }

  /**
   * Accepts a pending crew join request.
   *
   * @remarks Route: POST /api/social/crews/:crewId/join-requests/:requestId/accept. RLS requires crew management access.
   * @param data - The crew and request UUIDs.
   * @returns No response body.
   */
  @Post(':crewId/join-requests/:requestId/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptJoinRequest(
    @RequestData(new ValidateRequestPipe(acceptCrewJoinRequestRequestSchema)) data: { params: AcceptCrewJoinRequestParams },
  ): Promise<AcceptCrewJoinRequestResponse> {
    await this.service.acceptJoinRequestData(data.params.crewId, data.params.requestId);
  }

  /**
   * Accepts a pending crew invitation.
   *
   * @remarks Route: POST /api/social/crews/:crewId/invitations/:requestId/accept. RLS requires the invited user.
   * @param data - The crew and invitation UUIDs.
   * @returns No response body.
   */
  @Post(':crewId/invitations/:requestId/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptInvitation(
    @RequestData(new ValidateRequestPipe(acceptCrewInvitationRequestSchema)) data: { params: AcceptCrewInvitationParams },
  ): Promise<AcceptCrewInvitationResponse> {
    await this.service.acceptInvitationData(data.params.crewId, data.params.requestId);
  }
}
