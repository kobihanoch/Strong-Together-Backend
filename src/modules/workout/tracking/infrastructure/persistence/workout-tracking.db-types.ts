import { exerciseTracking } from '../../../../../infrastructure/db/schema/drizzle/tracking/exercise_tracking/table';
import { workoutSummary } from '../../../../../infrastructure/db/schema/drizzle/tracking/workout_summary/table';
import { exercise } from '../../../../../infrastructure/db/schema/drizzle/workout/exercises/table';
import { exerciseToWorkoutSplit } from '../../../../../infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table';
import { workoutSplit } from '../../../../../infrastructure/db/schema/drizzle/workout/workout_split/table';

/** Represents the tracking db row value. */
type TrackingDbRow = typeof exerciseTracking.$inferSelect;
/** Represents the summary db row value. */
type SummaryDbRow = typeof workoutSummary.$inferSelect;
/** Represents the assignment db row value. */
type AssignmentDbRow = typeof exerciseToWorkoutSplit.$inferSelect;
/** Represents the exercise db row value. */
type ExerciseDbRow = typeof exercise.$inferSelect;
/** Represents the split db row value. */
type SplitDbRow = typeof workoutSplit.$inferSelect;
/** Describes the tracking set sql value shape. */
interface TrackingSetSqlValue {
  reps: number;
  weight: number;
  setIndex: number;
}
/** Describes the exercise assignment sql value shape. */
interface ExerciseAssignmentSqlValue {
  exerciseToSplitId: AssignmentDbRow['id'] | null;
  orderIndex: AssignmentDbRow['orderIndex'] | null;
  exerciseId: ExerciseDbRow['id'];
  workoutSplitId: SplitDbRow['id'];
  workoutSplitName: SplitDbRow['name'];
  exerciseName: ExerciseDbRow['name'];
  targetMuscle: ExerciseDbRow['targetMuscle'];
  specificTargetMuscle: ExerciseDbRow['specificTargetMuscle'];
}
/** Describes the exercise tracking sql value shape. */
interface ExerciseTrackingSqlValue {
  exerciseTrackingId: TrackingDbRow['id'];
  sets: TrackingSetSqlValue[];
  notes: TrackingDbRow['notes'];
  exerciseAssignment: ExerciseAssignmentSqlValue;
}
/** Describes the personal record sql value shape. */
interface PersonalRecordSqlValue {
  exerciseToSplitId: AssignmentDbRow['id'] | null;
  exerciseName: ExerciseDbRow['name'];
  prWeight: number;
  prReps: number;
  prSetIndex: number;
  estimatedOneRepMax: number | null;
  workoutStartLocal: string;
}
/** Describes the workout history sql row shape. */
export interface WorkoutHistorySqlRow {
  data: { byDate: Record<string, { durationMins: number; exerciseTracked: Array<{ exerciseTracking: ExerciseTrackingSqlValue }> }> };
}
/** Describes the exercise history sql row shape. */
export interface ExerciseHistorySqlRow {
  data: { byExerciseToSplitId: Record<string, { exerciseTracked: Array<Omit<ExerciseTrackingSqlValue, 'notes'> & { workoutStartLocal: string }> }> };
}
/** Describes the workout statistics sql row shape. */
export interface WorkoutStatisticsSqlRow {
  data: {
    workoutCount: number;
    hasExerciseTracking: boolean;
    nextSplitByOrderIndex: (Pick<SplitDbRow, 'id' | 'name' | 'orderIndex'> & { muscleGroup: string | null }) | null;
    workoutTargets: { workoutCountThisWeek: number; workoutCountScheduledPerWeek: number };
    lastWorkoutStats: {
      workoutDate: string | null;
      workoutSplitName: string | null;
      exerciseTrackedCount: number | null;
      setTrackedCount: number | null;
    };
    latestPr: Array<PersonalRecordSqlValue & { exerciseId: ExerciseDbRow['id'] }>;
  };
}
/** Describes the personal records sql row shape. */
export interface PersonalRecordsSqlRow {
  data: { prs: Record<string, PersonalRecordSqlValue> };
}
/** Represents the workout history sql result value. */
export type WorkoutHistorySqlResult = WorkoutHistorySqlRow['data'];
/** Represents the exercise history sql result value. */
export type ExerciseHistorySqlResult = ExerciseHistorySqlRow['data'];
/** Represents the workout statistics sql result value. */
export type WorkoutStatisticsSqlResult = WorkoutStatisticsSqlRow['data'];
/** Represents the personal records sql result value. */
export type PersonalRecordsSqlResult = PersonalRecordsSqlRow['data'];
/** Describes the workout split lookup sql row shape. */
export interface WorkoutSplitLookupSqlRow {
  workoutSplitId: AssignmentDbRow['workoutSplitId'];
}
/** Represents the workout summary id sql row value. */
export type WorkoutSummaryIdSqlRow = Pick<SummaryDbRow, 'id'>;
/** Represents the exercise tracking id sql row value. */
export type ExerciseTrackingIdSqlRow = Pick<TrackingDbRow, 'id'>;
