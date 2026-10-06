import type { AerobicsHistory } from '../models/aerobics.models';

/** Read operations required by application queries. */
export abstract class AerobicsQueries {
  abstract findByUser(days: number, timezone: string): Promise<AerobicsHistory>;
}
