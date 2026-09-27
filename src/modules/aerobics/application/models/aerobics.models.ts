/** Application values required to create or replace an aerobic entry. */
export interface AerobicEntryInput {
  durationMins: number;
  durationSec: number;
  type: string;
}

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
