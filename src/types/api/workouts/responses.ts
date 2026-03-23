import type { ExerciseTrackingAndStats } from '../../dto/exerciseTracking.dto.ts';
import type { WholeUserWorkoutPlan, WorkoutSplitsMap } from '../../dto/workoutPlans.dto.ts';

export interface GetWholeUserWorkoutPlanResponse {
  workoutPlan: WholeUserWorkoutPlan | null;
  workoutPlanForEditWorkout: WorkoutSplitsMap | null;
}

export interface GetExerciseTrackingResponse extends ExerciseTrackingAndStats {}

export interface FinishUserWorkoutResponse extends ExerciseTrackingAndStats {}

export interface AddWorkoutResponse {
  message: string;
  workoutPlan: WholeUserWorkoutPlan;
  workoutPlanForEditWorkout: WorkoutSplitsMap;
}
