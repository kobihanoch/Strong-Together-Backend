/** Application values required to create or replace an aerobic entry. */
export interface AerobicEntryInput {
  durationMins: number;
  durationSec: number;
  type: string;
}

/** Outcome of updating an aerobic entry owned by a user. */
export type UpdateAerobicEntryOutcome = { kind: 'updated'; id: number } | { kind: 'not-found' };

/** Outcome of deleting an aerobic entry owned by a user. */
export type DeleteAerobicEntryOutcome = { kind: 'deleted'; id: number } | { kind: 'not-found' };

/** An aerobic entry grouped into a local calendar day. */
export interface AerobicsDailyRecord {
  id: number;
  type: string;
  durationSec: number;
  durationMins: number;
}

/** An aerobic entry included in a weekly aggregation. */
export interface AerobicsWeeklyRecord extends AerobicsDailyRecord {
  workoutTimeLocal: string;
}

/** Weekly aerobic records and their duration totals. */
export interface AerobicsWeeklyData {
  records: AerobicsWeeklyRecord[];
  totalDurationSec: number;
  totalDurationMins: number;
}

/** Aerobic history grouped by local day and week. */
export interface AerobicsHistory {
  daily: Record<string, AerobicsDailyRecord[]>;
  weekly: Record<string, AerobicsWeeklyData>;
}
