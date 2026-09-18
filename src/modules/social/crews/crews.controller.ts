import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type {
  CreateCrewBody,
  CreateCrewResponse,
  DeleteCrewParams,
  DeleteCrewProfilePictureParams,
  DeleteCrewProfilePictureResponse,
  GetCrewParams,
  GetCrewResponse,
  ListCrewsQuery,
  ListCrewsResponse,
  ListMyCrewsQuery,
  ListMyCrewsResponse,
  ListCrewParticipantsParams,
  ListCrewParticipantsQuery,
  ListCrewParticipantsResponse,
  LeaveCrewParams,
  LeaveCrewResponse,
  ReplaceCrewProfilePictureParams,
  ReplaceCrewProfilePictureResponse,
  UpdateCrewBody,
  UpdateCrewParams,
  UpdateCrewResponse,
} from '@strong-together/shared';
import {
  createCrewRequestSchema,
  deleteCrewRequestSchema,
  deleteCrewProfilePictureRequestSchema,
  getCrewRequestSchema,
  listCrewsRequestSchema,
  listMyCrewsRequestSchema,
  listCrewParticipantsRequestSchema,
  leaveCrewRequestSchema,
  replaceCrewProfilePictureRequestSchema,
  updateCrewRequestSchema,
} from '@strong-together/shared';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { CurrentLogger } from '../../../common/decorators/current-logger.decorator';
import { RequestData } from '../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../common/guards/dpop-validation.guard';
import { imageUploadOptions } from '../../../common/interceptors/image-upload.config';
import { ValidateRequestPipe } from '../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../common/types/express';
import type { AppLogger } from '../../../infrastructure/logger';
import { CrewsService } from './crews.service';

/**
 * Exposes authenticated CRUD endpoints for crews.
 *
 * Routes:
 * - GET /api/social/crews
 * - GET /api/social/crews/mine
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
@Roles('user')
export class CrewsController {
  constructor(private readonly service: CrewsService) {}

  /**
   * Lists the crews visible to the authenticated user.
   *
   * @remarks Route: GET /api/social/crews
   * Access: User
   *
   * @param data - The validated search and pagination query.
   * @returns The RLS-filtered crew collection.
   */
  @Get()
  async list(
    @RequestData(new ValidateRequestPipe(listCrewsRequestSchema))
    data: {
      query: ListCrewsQuery;
    },
  ): Promise<ListCrewsResponse> {
    return this.service.listCrewsData(data.query.limit, data.query.cursor, data.query.search);
  }

  /**
   * Lists crews in which the authenticated user has an active membership.
   *
   * @remarks Route: GET /api/social/crews/mine
   * Access: User
   *
   * @param data - The validated pagination query.
   * @returns The caller's crews with participant counts and previews.
   */
  @Get('mine')
  async listMine(
    @RequestData(new ValidateRequestPipe(listMyCrewsRequestSchema))
    data: {
      query: ListMyCrewsQuery;
    },
  ): Promise<ListMyCrewsResponse> {
    return this.service.listMyCrewsData(data.query.limit, data.query.cursor);
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
   * Replaces a crew's profile picture.
   *
   * @remarks Route: PUT /api/social/crews/:id/profile-picture. Access: active leader.
   * @param data - The validated crew ID.
   * @param file - The uploaded image file.
   * @param requestLogger - Logger used if old-image cleanup fails.
   * @returns The stored image path and public URL.
   */
  @Put(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  async replaceProfilePicture(
    @RequestData(new ValidateRequestPipe(replaceCrewProfilePictureRequestSchema)) data: { params: ReplaceCrewProfilePictureParams },
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentLogger() requestLogger: AppLogger,
  ): Promise<ReplaceCrewProfilePictureResponse> {
    return this.service.replaceProfilePicture(data.params.id, file, requestLogger);
  }

  /**
   * Deletes a crew's current profile picture.
   *
   * @remarks Route: DELETE /api/social/crews/:id/profile-picture. Access: active leader.
   * @param data - The validated crew ID.
   * @returns No response body with a 204 No Content status.
   * @throws NotFoundException when the crew is unavailable or has no picture.
   */
  @Delete(':id/profile-picture')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfilePicture(
    @RequestData(new ValidateRequestPipe(deleteCrewProfilePictureRequestSchema)) data: { params: DeleteCrewProfilePictureParams },
  ): Promise<DeleteCrewProfilePictureResponse> {
    await this.service.deleteProfilePicture(data.params.id);
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
}
