import { ExerciseEntity } from '../entities/exercise.entity.ts';
import { ExerciseToWorkoutSplitEntity } from '../entities/exerciseToWorkoutSplit.entity.ts';
import { WorkoutPlanEntity } from '../entities/workoutPlan.entity.ts';
import { WorkoutSplitEntity } from '../entities/workoutSplit.entity.ts';

export type ExerciseInPlan = Pick<ExerciseToWorkoutSplitEntity, 'id' | 'sets' | 'is_active'> &
  Pick<ExerciseEntity, 'targetmuscle' | 'specifictargetmuscle'> & {
    exercise: ExerciseEntity['name'] | null;
    workoutsplit: WorkoutSplitEntity['name'] | null;
  };

export type ExerciseMetadata = Pick<ExerciseEntity, 'targetmuscle' | 'specifictargetmuscle'>;

export interface WholeUserWorkoutPlan extends WorkoutPlanEntity {
  workoutsplits: Array<
    WorkoutSplitEntity & {
      exercisetoworkoutsplit: ExerciseInPlan[] | null;
    }
  > | null;
}

export interface AddWorkoutSplitPayload {
  [splitName: string]: Array<{
    id: number; // exercise_id
    sets: number | number[];
    order_index?: number | undefined;
  }>;
}

export interface WorkoutSplitsMap {
  [splitName: string]: Array<
    {
      id: number;
      name: string | null;
      sets: number[] | null;
      order_index: number | null;
    } & ExerciseMetadata
  >;
}
