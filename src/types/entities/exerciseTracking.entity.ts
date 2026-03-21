export interface ExerciseTrackingEntity {
  id: number;
  exercisetosplit_id: number | null;
  weight: number[] | null;
  reps: number[] | null;
  notes: string | null;
  workout_summary_id: string | null; // UUID
}
