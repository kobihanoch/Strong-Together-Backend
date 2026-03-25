export interface ExerciseTrackingEntity {
  id: number;
  exercisetosplit_id: number;
  weight: number[];
  reps: number[];
  notes: string | null;
  workout_summary_id: string; // UUID
}
