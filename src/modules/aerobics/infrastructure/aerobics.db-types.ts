import { aerobicTracking } from '../../../infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table';
import type { AerobicsHistory } from '../application/aerobics.models';

/** SQL row wrapping the aggregated aerobics history under its selected alias. */
export interface AerobicsHistorySqlRow {
  data: AerobicsHistory;
}

/** SQL row returned after updating or deleting an aerobic entry. */
export type AerobicMutationSqlRow = Pick<typeof aerobicTracking.$inferSelect, 'id'>;
