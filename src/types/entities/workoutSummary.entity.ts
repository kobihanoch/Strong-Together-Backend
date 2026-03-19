export interface WorkoutSummaryEntity {
  id: string; // UUID
  user_id: string; // UUID
  workout_start_utc: string;
  workout_end_utc: string | null;
  created_at: string;
  workoutsplit_id: number | null;
}
