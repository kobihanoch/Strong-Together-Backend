import type { AerobicEntry } from '../../domain/entities/aerobic-entry';
import type { DeleteAerobicEntryOutcome, UpdateAerobicEntryOutcome } from '../models/aerobics.models';

/** Persistence operations required by aerobics use cases. */
export abstract class AerobicsRepository {
  abstract createForUser(userId: string, entry: AerobicEntry): Promise<void>;
  abstract updateForUser(userId: string, id: number, entry: AerobicEntry): Promise<UpdateAerobicEntryOutcome>;
  abstract deleteForUser(userId: string, id: number): Promise<DeleteAerobicEntryOutcome>;
}
