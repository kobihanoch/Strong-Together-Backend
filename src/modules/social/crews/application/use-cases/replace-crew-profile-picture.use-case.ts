import { Injectable } from '@nestjs/common';
import mime from 'mime';
import path from 'path';
import { TransactionHooks } from '../../../../../common/application/ports/transaction-hooks.port';
import { CrewImageRequiredError, CrewNotFoundError } from '../errors/crews.errors';
import type { CrewImageUpload, CrewProfilePictureResult } from '../models/crews.models';
import { CrewImageStorage } from '../ports/crew-image-storage.port';
import { CrewsRepository } from '../ports/crews.repository';

/** Replaces a crew's profile picture and schedules old-image cleanup. */
@Injectable()
export class ReplaceCrewProfilePictureUseCase {
  public constructor(
    private readonly repository: CrewsRepository,
    private readonly storage: CrewImageStorage,
    private readonly hooks: TransactionHooks,
  ) {}
  /**
   * Executes the application operation.
   *
   * @param crewId - Crew identifier.
   * @param file - Uploaded image.
   * @param onCleanupFailure - Best-effort cleanup failure reporter.
   * @returns Stored image details.
   * @throws {CrewImageRequiredError} When no image is supplied.
   * @throws {CrewNotFoundError} When inaccessible or absent.
   */
  public async execute(
    crewId: string,
    file: CrewImageUpload | undefined,
    onCleanupFailure: (error: unknown, oldPath: string) => void,
  ): Promise<CrewProfilePictureResult> {
    if (!file) throw new CrewImageRequiredError();
    const oldPath = await this.repository.getProfilePictureForUpdate(crewId);
    if (oldPath === undefined) throw new CrewNotFoundError();
    const extension = path.extname(file.originalname) || `.${mime.getExtension(file.mimetype) || 'jpg'}`;
    const uploaded = await this.storage.upload(`${crewId}/${Date.now()}${extension}`, file.buffer, file.mimetype);
    await this.repository.updateProfilePicture(crewId, uploaded.path);
    if (oldPath)
      this.hooks.afterCommit(async () => {
        try {
          await this.storage.delete(oldPath);
        } catch (error: unknown) {
          onCleanupFailure(error, oldPath);
        }
      });
    return { profilePicPath: uploaded.path, url: uploaded.publicUrl, message: 'Upload success' };
  }
}
