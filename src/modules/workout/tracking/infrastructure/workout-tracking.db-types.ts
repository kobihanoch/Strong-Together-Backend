import { exerciseTracking } from '../../../../infrastructure/db/schema/drizzle/tracking/exercise_tracking/table';
import { workoutSummary } from '../../../../infrastructure/db/schema/drizzle/tracking/workout_summary/table';
import { exercise } from '../../../../infrastructure/db/schema/drizzle/workout/exercises/table';
import { exerciseToWorkoutSplit } from '../../../../infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table';
import { workoutSplit } from '../../../../infrastructure/db/schema/drizzle/workout/workout_split/table';

type TrackingDbRow = typeof exerciseTracking.$inferSelect;
type SummaryDbRow = typeof workoutSummary.$inferSelect;
type AssignmentDbRow = typeof exerciseToWorkoutSplit.$inferSelect;
type ExerciseDbRow = typeof exercise.$inferSelect;
type SplitDbRow = typeof workoutSplit.$inferSelect;
interface TrackingSetSqlValue {
  reps: number;
  weight: number;
  setIndex: number;
}
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
interface ExerciseTrackingSqlValue {
  exerciseTrackingId: TrackingDbRow['id'];
  sets: TrackingSetSqlValue[];
  notes: TrackingDbRow['notes'];
  exerciseAssignment: ExerciseAssignmentSqlValue;
}
interface PersonalRecordSqlValue {
  exerciseToSplitId: AssignmentDbRow['id'] | null;
  exerciseName: ExerciseDbRow['name'];
  prWeight: number;
  prReps: number;
  prSetIndex: number;
  estimatedOneRepMax: number | null;
  workoutStartLocal: string;
}
export interface WorkoutHistorySqlRow {
  data: { byDate: Record<string, { durationMins: number; exerciseTracked: Array<{ exerciseTracking: ExerciseTrackingSqlValue }> }> };
}
export interface ExerciseHistorySqlRow {
  data: { byExerciseToSplitId: Record<string, { exerciseTracked: Array<Omit<ExerciseTrackingSqlValue, 'notes'> & { workoutStartLocal: string }> }> };
}
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
export interface PersonalRecordsSqlRow {
  data: { prs: Record<string, PersonalRecordSqlValue> };
}
export type WorkoutHistorySqlResult = WorkoutHistorySqlRow['data'];
export type ExerciseHistorySqlResult = ExerciseHistorySqlRow['data'];
export type WorkoutStatisticsSqlResult = WorkoutStatisticsSqlRow['data'];
export type PersonalRecordsSqlResult = PersonalRecordsSqlRow['data'];
export interface WorkoutSplitLookupSqlRow {
  workoutSplitId: AssignmentDbRow['workoutSplitId'];
}
export type WorkoutSummaryIdSqlRow = Pick<SummaryDbRow, 'id'>;
export type ExerciseTrackingIdSqlRow = Pick<TrackingDbRow, 'id'>;
