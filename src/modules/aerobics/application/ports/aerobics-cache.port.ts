import type { AerobicsHistory } from '../models/aerobics.models';

/** A generation-stable cache entry for one aerobics-history request. */
export interface AerobicsCacheEntry {
  get(): Promise<AerobicsHistory | null>;
  set(value: AerobicsHistory): Promise<void>;
}

/** Cache operations required by aerobics use cases. */
export abstract class AerobicsCache {
  abstract forUser(userId: string, days: number, timezone: string): Promise<AerobicsCacheEntry>;
  abstract invalidateUser(userId: string): Promise<void>;
}
