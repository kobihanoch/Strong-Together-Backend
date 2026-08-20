import { z } from 'zod/v4';
import {
  addWorkoutRequest,
  exerciseInPlanSchema,
  wholeUserWorkoutPlanSchema,
  workoutSplitsMapItemSchema,
  workoutSplitsMapSchema,
} from './plan.schemas';

export type ExerciseInPlan = z.infer<typeof exerciseInPlanSchema>;
export type ExerciseMetadata = Pick<
  z.infer<typeof workoutSplitsMapItemSchema>,
  'targetMuscle' | 'specificTargetMuscle'
>;
export type WholeUserWorkoutPlan = z.infer<typeof wholeUserWorkoutPlanSchema>;
export type AddWorkoutSplitPayload = z.infer<typeof addWorkoutRequest.shape.body.shape.workoutData>;
export type WorkoutSplitsMap = z.infer<typeof workoutSplitsMapSchema>;
