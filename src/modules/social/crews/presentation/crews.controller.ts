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
  ListCrewParticipantsParams,
  ListCrewParticipantsQuery,
  ListCrewParticipantsResponse,
  ListCrewsQuery,
  ListCrewsResponse,
  ListMyCrewsQuery,
  ListMyCrewsResponse,
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
  deleteCrewProfilePictureRequestSchema,
  deleteCrewRequestSchema,
  getCrewRequestSchema,
  leaveCrewRequestSchema,
  listCrewParticipantsRequestSchema,
  listCrewsRequestSchema,
  listMyCrewsRequestSchema,
  replaceCrewProfilePictureRequestSchema,
  updateCrewRequestSchema,
} from '@strong-together/shared';
import { CurrentLogger } from '../../../../common/decorators/current-logger.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { imageUploadOptions } from '../../../../common/interceptors/image-upload.config';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
import type { AppLogger } from '../../../../infrastructure/logger';
import { CreateCrewUseCase } from '../application/use-cases/create-crew.use-case';
import { DeleteCrewProfilePictureUseCase } from '../application/use-cases/delete-crew-profile-picture.use-case';
import { DeleteCrewUseCase } from '../application/use-cases/delete-crew.use-case';
import { GetCrewUseCase } from '../application/use-cases/get-crew.use-case';
import { LeaveCrewUseCase } from '../application/use-cases/leave-crew.use-case';
import { ListCrewParticipantsUseCase } from '../application/use-cases/list-crew-participants.use-case';
import { ListCrewsUseCase } from '../application/use-cases/list-crews.use-case';
import { ListMyCrewsUseCase } from '../application/use-cases/list-my-crews.use-case';
import { ReplaceCrewProfilePictureUseCase } from '../application/use-cases/replace-crew-profile-picture.use-case';
import { UpdateCrewUseCase } from '../application/use-cases/update-crew.use-case';

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
  public constructor(
    private readonly listCrews: ListCrewsUseCase,
    private readonly listMyCrews: ListMyCrewsUseCase,
    private readonly listCrewParticipants: ListCrewParticipantsUseCase,
    private readonly getCrew: GetCrewUseCase,
    private readonly createCrew: CreateCrewUseCase,
    private readonly updateCrew: UpdateCrewUseCase,
    private readonly replaceCrewPicture: ReplaceCrewProfilePictureUseCase,
    private readonly deleteCrewPicture: DeleteCrewProfilePictureUseCase,
    private readonly leaveCrew: LeaveCrewUseCase,
    private readonly deleteCrew: DeleteCrewUseCase,
  ) {}

  /**
   * Lists the crews visible to the authenticated user.
   *
   * API: GET /api/social/crews
   * Access: Authenticated user
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
    return this.listCrews.execute(data.query.limit, data.query.cursor, data.query.search);
  }

  /**
   * Lists crews in which the authenticated user has an active membership.
   *
   * API: GET /api/social/crews/mine
   * Access: Authenticated user
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
    return this.listMyCrews.execute(data.query.limit, data.query.cursor);
  }

  /**
   * Lists active participants of an accessible crew.
   * Public crews expose participants to every authenticated user. Private crews
   * expose participants only to active members.
   *
   * API: GET /api/social/crews/:crewId/participants
   * Access: Authenticated user
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
    return this.listCrewParticipants.execute(data.params.crewId, data.query.limit, data.query.cursor);
  }

  /**
   * Gets a crew by its UUID.
   *
   * API: GET /api/social/crews/:id
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns The requested crew when it is visible to the caller.
   * @throws {CrewNotFoundError} when no visible crew has the supplied UUID.
   */
  @Get(':id')
  async get(
    @RequestData(new ValidateRequestPipe(getCrewRequestSchema))
    data: {
      params: GetCrewParams;
    },
  ): Promise<GetCrewResponse> {
    return this.getCrew.execute(data.params.id);
  }

  /**
   * Creates a crew led by the authenticated user.
   *
   * API: POST /api/social/crews
   * Access: Authenticated user
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
    await this.createCrew.execute(user.id, data.body);
  }

  /**
   * Updates a crew that the authenticated user is allowed to manage.
   *
   * API: PATCH /api/social/crews/:id
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated route parameters and update body.
   * @returns No response body with a 204 No Content status.
   * @throws {CrewNotFoundError} when RLS exposes no matching crew.
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
    await this.updateCrew.execute(data.params.id, data.body);
  }

  /**
   * Replaces a crew's profile picture.
   *
   * API: PUT /api/social/crews/:id/profile-picture. Access: active leader.
   * Access: Authenticated user
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
    return this.replaceCrewPicture.execute(data.params.id, file, (error, oldPath) =>
      requestLogger.warn({ err: error, crewId: data.params.id, oldPath }, 'Failed to delete old crew profile image'),
    );
  }

  /**
   * Deletes a crew's current profile picture.
   *
   * API: DELETE /api/social/crews/:id/profile-picture. Access: active leader.
   * Access: Authenticated user
   * @param data - The validated crew ID.
   * @returns No response body with a 204 No Content status.
   * @throws {CrewProfilePictureNotFoundError} When the crew is unavailable or has no picture.
   */
  @Delete(':id/profile-picture')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfilePicture(
    @RequestData(new ValidateRequestPipe(deleteCrewProfilePictureRequestSchema)) data: { params: DeleteCrewProfilePictureParams },
  ): Promise<DeleteCrewProfilePictureResponse> {
    await this.deleteCrewPicture.execute(data.params.id);
  }

  /**
   * Leaves an active crew membership.
   *
   * API: POST /api/social/crews/:id/leave
   * Access: Authenticated user
   * Access: User
   *
   * A regular member is marked as left. When the caller is the leader,
   * leadership first transfers to participant number two using the established
   * participant ordering.
   *
   * @param data - The validated crew identifier.
   * @returns No response body with a 204 No Content status.
   * @throws {ActiveCrewMembershipNotFoundError} When the caller is not an active member.
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
    await this.leaveCrew.execute(data.params.id);
  }

  /**
   * Deletes a crew that the authenticated user is allowed to manage.
   *
   * API: DELETE /api/social/crews/:id
   * Access: Authenticated user
   * Access: User
   *
   * @param data - The validated route parameters.
   * @returns No response body.
   * @throws {CrewNotFoundError} when RLS exposes no matching crew.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @RequestData(new ValidateRequestPipe(deleteCrewRequestSchema))
    data: {
      params: DeleteCrewParams;
    },
  ): Promise<void> {
    await this.deleteCrew.execute(data.params.id);
  }
}
