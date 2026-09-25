import type { AerobicEntryInput } from '../models/aerobics.models';

/** Persistence operations required by aerobics use cases. */
export abstract class AerobicsRepository {
  abstract createForUser(userId: string, record: AerobicEntryInput): Promise<void>;
  abstract updateForUser(userId: string, id: number, record: AerobicEntryInput): Promise<number | null>;
  abstract deleteForUser(userId: string, id: number): Promise<number | null>;
}
