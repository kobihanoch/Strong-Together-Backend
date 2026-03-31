export interface WorkoutSplitEntity {
  id: number;
  workout_id: number;
  name: string;
  created_at: string;
  muscle_group: string | null;
  is_active: boolean;
}
