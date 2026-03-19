export interface WorkoutSplitEntity {
  id: number;
  workout_id: number | null;
  name: string | null;
  created_at: string;
  muscle_group: string | null;
  is_active: boolean;
}
