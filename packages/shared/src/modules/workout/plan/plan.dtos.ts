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

/** Exercise input stored while adding a workout plan. */
export const workoutExerciseInputQueryDtoSchema = z.object({
  exerciseId: exerciseDbSchema.shape.id,
  sets: z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
});

const workoutSplitInputBaseQueryDtoSchema = z.object({
  name: workoutSplitDbSchema.shape.name.min(1, 'Split name is required'),
  orderIndex: z.number().int().nonnegative(),
  exercises: z.array(workoutExerciseInputQueryDtoSchema).min(1, 'Each split must include at least one exercise'),
});

/** Split input used while saving a plan. An omitted ID creates a new split. */
export const saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: workoutSplitDbSchema.shape.id.optional(),
});

export const saveWorkoutSplitPayloadQueryDtoSchema = z
  .array(saveWorkoutSplitInputQueryDtoSchema)
  .min(1, 'Workout must include at least one split');

/** Exercise assignment included in a complete workout-plan query. */
export const exerciseInPlanQueryDtoSchema = z.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  exerciseId: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: z.array(
    z.object({
      orderIndex: workoutSetDbSchema.shape.orderIndex,
      reps: workoutSetDbSchema.shape.reps,
    }),
  ),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});
/** Workout split included in a complete workout-plan query. */
export const workoutSplitQueryDtoSchema = z.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  orderIndex: workoutSplitDbSchema.shape.orderIndex,
  createdAt: serializedDateSchema,
  muscleGroup: z.string().nullable(),
  estimatedDurationMinutes: z.number().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exercises: z.array(exerciseInPlanQueryDtoSchema),
});
/** Complete active workout plan returned for a user. */
export const wholeUserWorkoutPlanQueryDtoSchema = z.object({
  id: workoutPlanDbSchema.shape.id,
  numberOfSplits: z.number(),
  createdAt: serializedDateSchema,
  userId: userDbSchema.shape.id,
  isActive: workoutPlanDbSchema.shape.isActive,
  updatedAt: serializedDateSchema,
  workoutSplits: z.array(workoutSplitQueryDtoSchema).nullable(),
});
/** SQL row returned when inserting or retrieving a workout plan. */
export const workoutPlanIdQueryDtoSchema = z.object({ id: workoutPlanDbSchema.shape.id });

/** SQL row returned when inserting or reactivating a workout split. */
export const workoutSplitIdQueryDtoSchema = z.object({ id: workoutSplitDbSchema.shape.id });

/** SQL row returned when inserting or reactivating an exercise assignment. */
export const exerciseAssignmentIdQueryDtoSchema = z.object({ id: exerciseToWorkoutSplitDbSchema.shape.id });

// SQL query DTO types

export type WorkoutExerciseInputQueryDto = z.infer<typeof workoutExerciseInputQueryDtoSchema>;
export type SaveWorkoutSplitInputQueryDto = z.infer<typeof saveWorkoutSplitInputQueryDtoSchema>;
export type ExerciseInPlanQueryDto = z.infer<typeof exerciseInPlanQueryDtoSchema>;
export type WorkoutSplitQueryDto = z.infer<typeof workoutSplitQueryDtoSchema>;
export type WholeUserWorkoutPlanQueryDto = z.infer<typeof wholeUserWorkoutPlanQueryDtoSchema>;

// SQL query input DTOs

export type SaveWorkoutSplitPayloadQueryDto = z.infer<typeof saveWorkoutSplitPayloadQueryDtoSchema>;
export type WorkoutPlanIdQueryDto = z.infer<typeof workoutPlanIdQueryDtoSchema>;
export type WorkoutSplitIdQueryDto = z.infer<typeof workoutSplitIdQueryDtoSchema>;
export type ExerciseAssignmentIdQueryDto = z.infer<typeof exerciseAssignmentIdQueryDtoSchema>;
