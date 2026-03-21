import { ExerciseEntity } from '../entities/exercise.entity.ts';
import { ExerciseToWorkoutSplitEntity } from '../entities/exerciseToWorkoutSplit.entity.ts';
import { ExerciseTrackingEntity } from '../entities/exerciseTracking.entity.ts';
import { WorkoutSplitEntity } from '../entities/workoutSplit.entity.ts';
import { WorkoutSummaryEntity } from '../entities/workoutSummary.entity.ts';

export interface ExerciseTrackingAnalysis {
  unique_days: number;
  most_frequent_split: string | null;
  most_frequent_split_days: number | null;
  lastWorkoutDate: string | null; // YYYY-MM-DD
  splitDaysByName: Record<string, number>;
  prs: {
    pr_max: {
      exercise: ExerciseEntity['name'];
      weight: number;
      reps: number;
      workout_time_utc: string; // "YYYY-MM-DD"
    } | null;
  };
}

export interface TrackingMapItem extends Omit<ExerciseTrackingEntity, 'workout_summary_id'> {
  exercisetosplit_id: ExerciseToWorkoutSplitEntity['id'];
  exercise_id: ExerciseEntity['id'];
  workoutsplit_id: WorkoutSplitEntity['id'] | null;
  splitname: WorkoutSplitEntity['name'] | null;
  exercise: ExerciseEntity['name'] | null;
  workoutdate: WorkoutSummaryEntity['workout_start_utc']; // YYYY-MM-DD
  order_index: number | null;
  exercisetoworkoutsplit: {
    sets: number[] | null;
    exercises: Pick<ExerciseEntity, 'targetmuscle' | 'specifictargetmuscle'>;
  };
}

export interface ExerciseTrackingAndStats {
  exerciseTrackingAnalysis: ExerciseTrackingAnalysis;
  exerciseTrackingMaps: {
    byDate: Record<string, Array<Omit<TrackingMapItem, 'workoutdate'>>>;
    byETSId: Record<string, TrackingMapItem[]>;
    bySplitName: Record<string, Array<Omit<TrackingMapItem, 'splitname'>>>;
  };
}

export interface FinishedWorkoutEntry {
  exercisetosplit_id: ExerciseToWorkoutSplitEntity['id'];
  weight: number[];
  reps: number[];
  notes?: ExerciseTrackingEntity['notes'] | null | undefined;
}
