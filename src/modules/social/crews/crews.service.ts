import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateCrewBody,
  CrewWithParticipantCountQueryDto,
  ListCrewParticipantsResponse,
  ListCrewsResponse,
  ListMyCrewsResponse,
  ReplaceCrewProfilePictureResponse,
  UpdateCrewBody,
} from '@strong-together/shared';
import mime from 'mime';
import path from 'path';
import { supabaseConfig } from '../../../config/storage.config';
import type { AppLogger } from '../../../infrastructure/logger';
import { SupabaseStorageService } from '../../../infrastructure/supabase/storage/supabase-storage.service';
import { CrewsQueries } from './crews.queries';
import { decodeSocialCursor, encodeSocialCursor } from '../cursor-pagination';
/** Coordinates social crew CRUD operations and maps empty query results to HTTP errors. */
@Injectable()
export class CrewsService {
  constructor(
    private readonly queries: CrewsQueries,
    private readonly storage: SupabaseStorageService,
  ) {}

  /**
   * Lists discoverable crews with a limited participant preview.
   *
   * @param limit - The maximum number of crews to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @param search - Optional text matched against crew names.
   * @returns A contract object containing the visible crews.
   */
  async listCrewsData(limit: number, cursor?: string, search?: string): Promise<ListCrewsResponse> {
    const rows = await this.queries.queryCrews(limit, decodeSocialCursor(cursor), search);
    const crews = rows.slice(0, limit);
    const last = crews.at(-1);
    return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
  }

  /**
   * Lists crews in which the caller has an active membership.
   *
   * @param limit - The maximum number of crews to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns The caller's crews using the discoverable-crew response shape.
   */
  async listMyCrewsData(limit: number, cursor?: string): Promise<ListMyCrewsResponse> {
    const rows = await this.queries.queryMyCrews(limit, decodeSocialCursor(cursor));
    const crews = rows.slice(0, limit);
    const last = crews.at(-1);
    return { crews, nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.createdAt, id: last.id }) : null };
  }

  /**
   * Lists active participants when the crew is public or the caller belongs to it.
   *
   * @param crewId - The UUID of the crew whose participants are requested.
   * @param limit - The maximum number of participants to return.
   * @param cursor - The opaque cursor returned by the preceding page.
   * @returns A contract object containing the authorized participant rows.
   */
  async listCrewParticipantsData(crewId: string, limit: number, cursor?: string): Promise<ListCrewParticipantsResponse> {
    const decodedCursor = decodeSocialCursor(cursor);
    const rows = await this.queries.queryCrewParticipants(
      crewId,
      limit,
      decodedCursor ? { timestamp: decodedCursor.timestamp, id: decodedCursor.id, rank: decodedCursor.rank } : undefined,
    );
    const participants = rows.slice(0, limit);
    const last = participants.at(-1);
    const rank = last?.role === 'leader' ? 1 : last?.role === 'admin' ? 2 : 3;
    return {
      participants,
      nextCursor: rows.length > limit && last ? encodeSocialCursor({ timestamp: last.joinedAt, id: last.id, rank }) : null,
    };
  }
  /**
   * Gets one visible crew.
   *
   * @param id - The crew UUID.
   * @returns The matching crew.
   * @throws NotFoundException when the query returns no visible crew.
   */
  async getCrewData(id: string): Promise<CrewWithParticipantCountQueryDto> {
    const [row] = await this.queries.queryCrew(id);
    if (!row) throw new NotFoundException('Crew not found');
    return row;
  }
  /**
   * Creates a crew and assigns its creator as the leader.
   *
   * @param userId - The authenticated creator's UUID.
   * @param body - The validated crew creation data.
   * @returns A promise that resolves after creation.
   */
  async createCrewData(userId: string, body: CreateCrewBody): Promise<void> {
    await this.queries.queryCreateCrew(userId, body.name, body.privacy);
  }
  /**
   * Updates a crew through the caller's RLS transaction.
   *
   * @param id - The crew UUID.
   * @param body - The validated crew update data.
   * @returns A promise that resolves after the update.
   * @throws NotFoundException when no permitted crew is updated.
   */
  async updateCrewData(id: string, body: UpdateCrewBody): Promise<void> {
    const [row] = await this.queries.queryUpdateCrew(id, body.name, body.privacy);
    if (!row) throw new NotFoundException('Crew not found');
  }

  /**
   * Uploads and stores a new crew profile picture for an active leader.
   *
   * @param crewId - The crew receiving the picture.
   * @param file - The validated uploaded image.
   * @param requestLogger - Logger used if old-image cleanup fails.
   * @returns The stored image path and public URL.
   */
  async replaceProfilePicture(
    crewId: string,
    file: Express.Multer.File | undefined,
    requestLogger: AppLogger,
  ): Promise<ReplaceCrewProfilePictureResponse> {
    if (!file) throw new BadRequestException('No file provided');

    const [crew] = await this.queries.queryCrewProfilePictureForUpdate(crewId);
    if (!crew) throw new NotFoundException('Crew not found');

    const extension = path.extname(file.originalname) || `.${mime.getExtension(file.mimetype) || 'jpg'}`;
    const key = `${crewId}/${Date.now()}${extension}`;
    const uploaded = await this.storage.uploadBufferToSupabase(supabaseConfig.bucketName, key, file.buffer, file.mimetype);

    await this.queries.queryUpdateCrewProfilePicture(crewId, uploaded.path);

    if (crew.profilePicPath) {
      this.storage.deleteFromSupabase(crew.profilePicPath).catch((error: unknown) => {
        requestLogger.warn({ err: error, crewId, oldPath: crew.profilePicPath }, 'Failed to delete old crew profile image');
      });
    }

    return { profilePicPath: uploaded.path, url: uploaded.publicUrl, message: 'Upload success' };
  }

  /**
   * Deletes an active leader's crew profile picture from storage and the database.
   *
   * @param crewId - The crew whose picture is deleted.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when the crew is unavailable or has no picture.
   */
  async deleteProfilePicture(crewId: string): Promise<void> {
    const [crew] = await this.queries.queryCrewProfilePictureForUpdate(crewId);
    if (!crew?.profilePicPath) throw new NotFoundException('Crew profile picture not found');

    await this.storage.deleteFromSupabase(crew.profilePicPath);
    await this.queries.queryUpdateCrewProfilePicture(crewId, null);
  }

  /**
   * Leaves a crew and transfers leadership when the caller is its leader.
   * If no succsor found - means no other users in crew. SO leave crew and delete it.
   *
   * @param crewId - The UUID of the crew the current user wants to leave.
   * @returns A promise that resolves after the membership is marked as left.
   * @throws NotFoundException when the caller has no active crew membership.
   */
  async leaveCrewData(crewId: string): Promise<void> {
    const [outcome] = await this.queries.queryLeaveCrew(crewId);

    if (!outcome || outcome.result === 'not_member') {
      throw new NotFoundException('Active crew membership not found');
    }
  }

  /**
   * Deletes a crew through the caller's RLS transaction.
   *
   * @param id - The crew UUID.
   * @returns A promise that resolves after deletion.
   * @throws NotFoundException when no permitted crew is deleted.
   */
  async deleteCrewData(id: string): Promise<void> {
    if (!(await this.queries.queryDeleteCrew(id)).length) throw new NotFoundException('Crew not found');
  }
}
