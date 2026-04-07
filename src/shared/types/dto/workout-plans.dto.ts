import { ExerciseEntity } from '../entities/exercise.entity.ts';
import { ExerciseToWorkoutSplitEntity } from '../entities/exercise-to-workout-split.entity.ts';
import { WorkoutPlanEntity } from '../entities/workout-plan.entity.ts';
import { WorkoutSplitEntity } from '../entities/workout-split.entity.ts';

export type ExerciseInPlan = {
  id: ExerciseToWorkoutSplitEntity['id'];
  sets: ExerciseToWorkoutSplitEntity['sets'];
  is_active: ExerciseToWorkoutSplitEntity['is_active'];
  targetmuscle: ExerciseEntity['targetmuscle'];
  specifictargetmuscle: ExerciseEntity['specifictargetmuscle'];
  exercise: ExerciseEntity['name'];
  workoutsplit: WorkoutSplitEntity['name'];
};

export type ExerciseMetadata = Pick<ExerciseEntity, 'targetmuscle' | 'specifictargetmuscle'>;

export interface WholeUserWorkoutPlan extends WorkoutPlanEntity {
  workoutsplits: Array<
    WorkoutSplitEntity & {
      exercisetoworkoutsplit: ExerciseInPlan[];
    }
  > | null;
}

export interface AddWorkoutSplitPayload {
  [splitName: WorkoutSplitEntity['name']]: Array<{
    id: ExerciseEntity['id']; // exercise_id
    sets: ExerciseToWorkoutSplitEntity['sets'];
    order_index: ExerciseToWorkoutSplitEntity['order_index'];
  }>;
}

export interface WorkoutSplitsMap {
  [splitName: WorkoutSplitEntity['name']]: Array<
    {
      id: ExerciseEntity['id'];
      name: ExerciseEntity['name'];
      sets: ExerciseToWorkoutSplitEntity['sets'];
      order_index: ExerciseToWorkoutSplitEntity['order_index'];
    } & ExerciseMetadata
  >;
}
