import { aerobicTracking } from '../../../infrastructure/db/schema/drizzle/tracking/aerobic_tracking/table';

/** Represents the aerobic tracking db row value. */
type AerobicTrackingDbRow = typeof aerobicTracking.$inferSelect;

/** Direct and calculated aerobic fields embedded in daily SQL aggregates. */
export interface AerobicsDailySqlRecord extends Pick<AerobicTrackingDbRow, 'id' | 'type'> {
  durationSec: number;
  durationMins: number;
}

/** Aerobic fields embedded in weekly SQL aggregates. */
export interface AerobicsWeeklySqlRecord extends AerobicsDailySqlRecord {
  workoutTimeLocal: string;
}

/** Weekly aggregate returned inside the aerobics history JSON value. */
export interface AerobicsWeeklySqlData {
  records: AerobicsWeeklySqlRecord[];
  totalDurationSec: number;
  totalDurationMins: number;
}

/** JSON aggregation produced by the aerobics history query. */
export interface AerobicsHistorySqlData {
  daily: Record<string, AerobicsDailySqlRecord[]>;
  weekly: Record<string, AerobicsWeeklySqlData>;
}

/** SQL row wrapping the aggregated aerobics history under its selected alias. */
export interface AerobicsHistorySqlRow {
  data: AerobicsHistorySqlData;
}

/** SQL row returned after updating or deleting an aerobic entry. */
export type AerobicMutationSqlRow = Pick<typeof aerobicTracking.$inferSelect, 'id'>;
