export interface ExerciseToWorkoutSplitEntity {
  id: number;
  exercise_id: number;
  workoutsplit_id: number;
  created_at: string;
  sets: number[];
  order_index: number;
  is_active: boolean;
}
