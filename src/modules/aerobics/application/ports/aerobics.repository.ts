import type { AerobicEntryInput, DeleteAerobicEntryOutcome, UpdateAerobicEntryOutcome } from '../models/aerobics.models';

/** Persistence operations required by aerobics use cases. */
export abstract class AerobicsRepository {
  abstract createForUser(userId: string, record: AerobicEntryInput): Promise<void>;
  abstract updateForUser(userId: string, id: number, record: AerobicEntryInput): Promise<UpdateAerobicEntryOutcome>;
  abstract deleteForUser(userId: string, id: number): Promise<DeleteAerobicEntryOutcome>;
}
