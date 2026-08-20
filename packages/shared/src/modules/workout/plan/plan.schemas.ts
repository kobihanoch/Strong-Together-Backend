import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import {
  exerciseDbSchema,
  exerciseToWorkoutSplitDbSchema,
  userDbSchema,
  workoutPlanDbSchema,
  workoutSetDbSchema,
  workoutSplitDbSchema,
} from '../../../database';

const workoutExerciseSchema = z.object({
  id: exerciseDbSchema.shape.id,
  sets: z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
});

export const exerciseInPlanSchema = z.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id,
  sets: z.array(workoutSetDbSchema.shape.reps),
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
  exercise: exerciseDbSchema.shape.name,
  workoutSplit: workoutSplitDbSchema.shape.name,
});

export const workoutSplitSchema = z.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  createdAt: serializedDateSchema,
  muscleGroup: z.string().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exerciseToWorkoutSplit: z.array(exerciseInPlanSchema),
});

export const wholeUserWorkoutPlanSchema = z.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: z.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: z.array(workoutSplitSchema).nullable(),
});

export const workoutSplitsMapItemSchema = z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});

export const workoutSplitsMapSchema = z.record(z.string(), z.array(workoutSplitsMapItemSchema));

const addWorkoutSplitPayloadSchema = z.record(
  z.string(),
  z.array(workoutExerciseSchema).min(1, 'Each split must include at least one exercise'),
);

export const addWorkoutRequest = z.object({
  body: z.object({
    workoutData: addWorkoutSplitPayloadSchema,
    workoutName: z.string().optional(),
    tz: z.string(),
  }),
});

export const addWorkoutResponseSchema = z.object({
  message: z.string(),
  workoutPlan: wholeUserWorkoutPlanSchema,
  workoutPlanForEditWorkout: workoutSplitsMapSchema,
});

export const getWholeWorkoutPlanRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export const getWholeUserWorkoutPlanResponseSchema = z.object({
  workoutPlan: wholeUserWorkoutPlanSchema.nullable(),
  workoutPlanForEditWorkout: workoutSplitsMapSchema.nullable(),
});
