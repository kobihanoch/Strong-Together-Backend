export interface AerobicEntity {
  id: number;
  user_id: string | null;
  type: string | null;
  duration_mins: number;
  duration_sec: number;
  workout_time_utc: string;
}
