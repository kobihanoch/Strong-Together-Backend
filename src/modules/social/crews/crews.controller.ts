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
  UpdateCrewBody,
  UpdateCrewParams,
  UpdateCrewResponse,
} from '@strong-together/shared';
import {
  createCrewRequestSchema,
  deleteCrewRequestSchema,
  getCrewRequestSchema,
  listCrewsRequestSchema,
  listCrewParticipantsRequestSchema,
  updateCrewRequestSchema,
} from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/auth/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/auth/authorization.guard';
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
    return this.service.listCrewsData(data.query.limit, data.query.offset);
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
    return this.service.listCrewParticipantsData(data.params.crewId, data.query.limit, data.query.offset);
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
}
