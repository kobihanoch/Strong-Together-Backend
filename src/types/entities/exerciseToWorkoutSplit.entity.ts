export interface ExerciseToWorkoutSplitEntity {
  id: number;
  exercise_id: number | null;
  workoutsplit_id: number | null;
  created_at: string;
  sets: number[] | null;
  order_index: number | null;
  is_active: boolean;
}
