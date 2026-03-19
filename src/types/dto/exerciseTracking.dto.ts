import { ExerciseEntity } from "../entities/exercise.entity.ts";
import { ExerciseTrackingEntity } from "../entities/exerciseTracking.entity.ts";

export interface ExerciseTrackingAnalysis {
  unique_days: number;
  most_frequent_split: string | null;
  most_frequent_split_days: number | null;
  lastWorkoutDate: string | null; // YYYY-MM-DD
  splitDaysByName: Record<string, number>;
  prs: {
    pr_max: {
      exercise: string;
      weight: number;
      reps: number;
      workout_time_utc: string; // "YYYY-MM-DD"
    } | null;
  };
}

export interface TrackingMapItem extends Omit<
  ExerciseTrackingEntity,
  "workout_summary_id"
> {
  exercisetosplit_id: number;
  exercise_id: number;
  workoutsplit_id: number | null;
  splitname: string | null;
  exercise: string | null;
  workoutdate: string; // YYYY-MM-DD
  order_index: number | null;
  exercisetoworkoutsplit: {
    sets: number[] | null;
    exercises: Pick<ExerciseEntity, "targetmuscle" | "specifictargetmuscle">;
  };
}

export interface ExerciseTrackingAndStats {
  exerciseTrackingAnalysis: ExerciseTrackingAnalysis;
  exerciseTrackingMaps: {
    byDate: Record<string, Array<Omit<TrackingMapItem, "workoutdate">>>;
    byETSId: Record<string, TrackingMapItem[]>;
    bySplitName: Record<string, Array<Omit<TrackingMapItem, "splitname">>>;
  };
}

export interface FinishedWorkoutEntry {
  exercisetosplit_id: number;
  weight: number[];
  reps: number[];
  notes?: string | null;
}
