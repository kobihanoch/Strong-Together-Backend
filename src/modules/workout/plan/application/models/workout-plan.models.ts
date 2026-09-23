/** Planned set values submitted for an exercise. */
export interface WorkoutPlanSet {
  orderIndex: number;
  reps: number;
}
/** Exercise assignment submitted while replacing a workout plan. */
export interface WorkoutExerciseInput {
  exerciseId: number;
  sets: number[];
  orderIndex: number;
}
/** Workout split submitted while replacing a plan. */
export interface WorkoutSplitInput {
  id?: number | undefined;
  name: string;
  orderIndex: number;
  exercises: WorkoutExerciseInput[];
}
/** Exercise assignment returned in an active workout plan. */
export interface WorkoutPlanExercise {
  exerciseToSplitId: number;
  exerciseId: number;
  name: string;
  sets: WorkoutPlanSet[];
  orderIndex: number;
  isActive: boolean;
  targetMuscle: string;
  specificTargetMuscle: string;
}
/** Active workout split read projection. */
export interface WorkoutPlanSplit {
  id: number;
  workoutId: number;
  name: string;
  orderIndex: number;
  createdAt: string;
  muscleGroup: string | null;
  estimatedDurationMinutes: number | null;
  isActive: boolean;
  exercises: WorkoutPlanExercise[];
}
/** Complete active workout-plan read projection. */
export interface WorkoutPlan {
  id: number;
  numberOfSplits: number;
  createdAt: string;
  userId: string;
  isActive: boolean;
  updatedAt: string;
  workoutSplits: WorkoutPlanSplit[] | null;
}
/** Workout-plan response produced by the application. */
export interface WorkoutPlanResult {
  workoutPlan: WorkoutPlan | null;
}

/** Outcome of atomically replacing an active workout plan. */
export type ReplaceWorkoutPlanOutcome = { kind: 'replaced' } | { kind: 'split-not-owned'; splitId: number };
