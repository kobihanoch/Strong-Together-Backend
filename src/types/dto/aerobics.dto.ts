import { AerobicEntity } from "../entities/aerobic.entity.ts";

export interface AddAerobicInput {
  durationMins: number;
  durationSec: number;
  type: string;
}

export type AerobicsDailyRecord = Pick<
  AerobicEntity,
  "type" | "duration_sec" | "duration_mins"
>;

export interface AerobicsWeeklyRecord extends AerobicsDailyRecord {
  workout_time_utc: string;
}

export interface WeeklyData {
  records: AerobicsWeeklyRecord[];
  total_duration_sec: number;
  total_duration_mins: number;
}
