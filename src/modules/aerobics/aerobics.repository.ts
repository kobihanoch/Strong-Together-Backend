import type { AddAerobicInputQueryDto, UserAerobicsQueryDto } from '@strong-together/shared';

/**
 * Defines the persistence operations required by aerobics use cases.
 *
 * The contract keeps application services independent of SQL, PostgreSQL,
 * and the concrete query implementation used to store aerobic activity.
 */
export abstract class AerobicsRepository {
  /**
   * Retrieves a user's aerobic activity over a recent date window.
   *
   * @param userId - The identifier of the user whose activity is requested.
   * @param days - The number of recent calendar days to include.
   * @param timezone - The IANA time-zone name used to calculate date boundaries.
   * @returns The user's aerobic activity grouped for the requested period.
   */
  abstract findAerobicsByUser(userId: string, days: number, timezone: string): Promise<UserAerobicsQueryDto>;

  /**
   * Creates an aerobic tracking entry for a user.
   *
   * @param userId - The identifier of the user who owns the entry.
   * @param record - The aerobic activity values to persist.
   * @returns A promise that resolves after the entry has been persisted.
   */
  abstract createAerobicForUser(userId: string, record: AddAerobicInputQueryDto): Promise<void>;

  /**
   * Updates an aerobic tracking entry owned by a user.
   *
   * @param userId - The identifier of the user who owns the entry.
   * @param id - The identifier of the aerobic tracking entry.
   * @param record - The replacement aerobic activity values.
   * @returns The updated entry identifier, or `null` when no matching entry exists.
   */
  abstract updateAerobicForUser(userId: string, id: number, record: AddAerobicInputQueryDto): Promise<number | null>;

  /**
   * Deletes an aerobic tracking entry owned by a user.
   *
   * @param userId - The identifier of the user who owns the entry.
   * @param id - The identifier of the aerobic tracking entry.
   * @returns The deleted entry identifier, or `null` when no matching entry exists.
   */
  abstract deleteAerobicForUser(userId: string, id: number): Promise<number | null>;
}
