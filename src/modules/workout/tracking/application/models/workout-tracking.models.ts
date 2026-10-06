/** Completed set submitted for workout tracking. */
export interface TrackedSetInput {
  reps: number;
  weight: number;
  setIndex: number;
}
/** Completed exercise submitted for a workout session. */
export type FinishedWorkoutEntry =
  | {
      trackedSets: TrackedSetInput[];
      notes?: string | null | undefined;
      isExerciseAssignedToSplit: true;
      exerciseToSplitId: number;
      exerciseId?: number | null | undefined;
    }
  | {
      trackedSets: TrackedSetInput[];
      notes?: string | null | undefined;
      isExerciseAssignedToSplit: false;
      exerciseToSplitId?: null | undefined;
      exerciseId: number;
    };
/** Command for persisting a completed workout. */
export interface CreateWorkoutSessionCommand {
  workout: FinishedWorkoutEntry[];
  workoutStartUtc: string;
  workoutEndUtc?: string | null | undefined;
}
/** Exercise assignment nested in a history record. */
export interface TrackingExerciseAssignment {
  exerciseToSplitId: number | null;
  orderIndex: number | null;
  exerciseId: number;
  workoutSplitId: number;
  workoutSplitName: string;
  exerciseName: string;
  targetMuscle: string;
  specificTargetMuscle: string;
}
/** Tracked exercise record grouped in workout history. */
export interface GroupedTrackingItem {
  exerciseTracking: { exerciseTrackingId: number; sets: TrackedSetInput[]; notes: string | null; exerciseAssignment: TrackingExerciseAssignment };
}
/** Workout history grouped by local workout date. */
export interface WorkoutHistory {
  byDate: Record<string, { durationMins: number; exerciseTracked: GroupedTrackingItem[] }>;
}
/** Exercise-history item with a localized workout start. */
export type ExerciseHistoryItem = Omit<GroupedTrackingItem['exerciseTracking'], 'notes'> & { workoutStartLocal: string };
/** Exercise history grouped by exercise assignment. */
export interface ExerciseHistory {
  byExerciseToSplitId: Record<string, { exerciseTracked: ExerciseHistoryItem[] }>;
}
/** Current personal record for one exercise. */
export interface PersonalRecord {
  exerciseToSplitId: number | null;
  exerciseName: string;
  prWeight: number;
  prReps: number;
  prSetIndex: number;
  estimatedOneRepMax: number | null;
  workoutStartLocal: string;
}
/** Current personal records keyed by exercise. */
export interface PersonalRecords {
  prs: Record<string, PersonalRecord>;
}
/** Aggregate workout statistics. */
export interface WorkoutStatistics {
  workoutCount: number;
  hasExerciseTracking: boolean;
  nextSplitByOrderIndex: { id: number; name: string; orderIndex: number; muscleGroup: string | null } | null;
  workoutTargets: { workoutCountThisWeek: number; workoutCountScheduledPerWeek: number };
  lastWorkoutStats: {
    workoutDate: string | null;
    workoutSplitName: string | null;
    exerciseTrackedCount: number | null;
    setTrackedCount: number | null;
  };
  latestPr: Array<PersonalRecord & { exerciseId: number }>;
}
