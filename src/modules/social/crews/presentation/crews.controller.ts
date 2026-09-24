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
import { OperationLogger } from '../../../../common/application/ports/operation-logger.port';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { RequestData } from '../../../../common/decorators/request-data.decorator';
import { AuthenticationGuard } from '../../../../common/guards/authentication.guard';
import { AuthorizationGuard, Roles } from '../../../../common/guards/authorization.guard';
import { DpopGuard } from '../../../../common/guards/dpop-validation.guard';
import { imageUploadOptions } from '../../../../common/interceptors/image-upload.config';
import { ValidateRequestPipe } from '../../../../common/pipes/validate-request.pipe';
import type { AuthenticatedUser } from '../../../../common/types/express';
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

/** Exposes authenticated CRUD endpoints for crews. */
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
    private readonly logger: OperationLogger,
  ) {}

  /**
   * Lists the crews visible to the authenticated user.
   *
   * API: `GET /api/social/crews`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated search and pagination query.
   * @returns The RLS-filtered crew collection.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get()
  async list(
    @RequestData(new ValidateRequestPipe(listCrewsRequestSchema))
    data: {
      query: ListCrewsQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListCrewsResponse> {
    return this.listCrews.execute(user.id, data.query.limit, data.query.cursor, data.query.search);
  }

  /**
   * Lists crews in which the authenticated user has an active membership.
   *
   * API: `GET /api/social/crews/mine`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated pagination query.
   * @returns The caller's crews with participant counts and previews.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get('mine')
  async listMine(
    @RequestData(new ValidateRequestPipe(listMyCrewsRequestSchema))
    data: {
      query: ListMyCrewsQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListMyCrewsResponse> {
    return this.listMyCrews.execute(user.id, data.query.limit, data.query.cursor);
  }

  /**
   * Lists active participants of an accessible crew.
   * Public crews expose participants to every authenticated user. Private crews
   * expose participants only to active members.
   *
   * API: `GET /api/social/crews/:crewId/participants`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated crew identifier and pagination query.
   * @returns The paginated active participant collection.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get(':crewId/participants')
  async listParticipants(
    @RequestData(new ValidateRequestPipe(listCrewParticipantsRequestSchema))
    data: {
      params: ListCrewParticipantsParams;
      query: ListCrewParticipantsQuery;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListCrewParticipantsResponse> {
    return this.listCrewParticipants.execute(user.id, data.params.crewId, data.query.limit, data.query.cursor);
  }

  /**
   * Gets a crew by its UUID.
   *
   * API: `GET /api/social/crews/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated route parameters.
   * @returns The requested crew when it is visible to the caller.
   * @throws {CrewNotFoundError} when no visible crew has the supplied UUID.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Get(':id')
  async get(
    @RequestData(new ValidateRequestPipe(getCrewRequestSchema))
    data: {
      params: GetCrewParams;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetCrewResponse> {
    return this.getCrew.execute(user.id, data.params.id);
  }

  /**
   * Creates a crew led by the authenticated user.
   *
   * API: `POST /api/social/crews`.
   * Authorized roles: `user`.
   * HTTP responses: `201 Created`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated crew creation body.
   * @param user - The authenticated user supplied by the authentication guard.
   * @returns No response body with a 201 Created status.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
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
   * API: `PATCH /api/social/crews/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated route parameters and update body.
   * @returns No response body with a 204 No Content status.
   * @throws {CrewNotFoundError} when RLS exposes no matching crew.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @RequestData(new ValidateRequestPipe(updateCrewRequestSchema))
    data: {
      params: UpdateCrewParams;
      body: UpdateCrewBody;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UpdateCrewResponse> {
    await this.updateCrew.execute(user.id, data.params.id, data.body);
  }

  /**
   * Replaces a crew's profile picture.
   *
   * API: `PUT /api/social/crews/:id/profile-picture`.
   * Authorized roles: `user`.
   * HTTP responses: `200 OK`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`.
   *
   * @param data - The validated crew ID.
   * @param file - The uploaded image file.
   * @returns The stored image path and public URL.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Put(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  async replaceProfilePicture(
    @RequestData(new ValidateRequestPipe(replaceCrewProfilePictureRequestSchema)) data: { params: ReplaceCrewProfilePictureParams },
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ReplaceCrewProfilePictureResponse> {
    return this.replaceCrewPicture.execute(user.id, data.params.id, file, (error, oldPath) =>
      this.logger.warn({ err: error, crewId: data.params.id, oldPath }, 'Failed to delete old crew profile image'),
    );
  }

  /**
   * Deletes a crew's current profile picture.
   *
   * API: `DELETE /api/social/crews/:id/profile-picture`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated crew ID.
   * @returns No response body with a 204 No Content status.
   * @throws {CrewProfilePictureNotFoundError} When the crew is unavailable or has no picture.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete(':id/profile-picture')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfilePicture(
    @RequestData(new ValidateRequestPipe(deleteCrewProfilePictureRequestSchema)) data: { params: DeleteCrewProfilePictureParams },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteCrewProfilePictureResponse> {
    await this.deleteCrewPicture.execute(user.id, data.params.id);
  }

  /**
   * Leaves an active crew membership.
   * A regular member is marked as left. When the caller is the leader,
   * leadership first transfers to participant number two using the established
   * participant ordering.
   *
   * API: `POST /api/social/crews/:id/leave`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated crew identifier.
   * @returns No response body with a 204 No Content status.
   * @throws {ActiveCrewMembershipNotFoundError} When the caller is not an active member. When the leader is the crew's final active member, leaving deletes the crew.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Post(':id/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @RequestData(new ValidateRequestPipe(leaveCrewRequestSchema))
    data: {
      params: LeaveCrewParams;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<LeaveCrewResponse> {
    await this.leaveCrew.execute(user.id, data.params.id);
  }

  /**
   * Deletes a crew that the authenticated user is allowed to manage.
   *
   * API: `DELETE /api/social/crews/:id`.
   * Authorized roles: `user`.
   * HTTP responses: `204 No Content`; `400 Bad Request`; `401 Unauthorized`; `403 Forbidden`; `404 Not Found`.
   *
   * @param data - The validated route parameters.
   * @returns No response body.
   * @throws {CrewNotFoundError} when RLS exposes no matching crew.
   * @throws {BadRequestException} When request validation fails.
   * @throws {UnauthorizedException} When authentication fails.
   * @throws {ForbiddenException} When role authorization fails.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @RequestData(new ValidateRequestPipe(deleteCrewRequestSchema))
    data: {
      params: DeleteCrewParams;
    },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    await this.deleteCrew.execute(user.id, data.params.id);
  }
}
