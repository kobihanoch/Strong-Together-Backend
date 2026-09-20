import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
const idSchema = z.number().int();
const uuidSchema = z.string().uuid();
const textSchema = z.string();
const booleanSchema = z.boolean();
const numberSchema = z.number();

/** Exercise input stored while adding a workout plan. */
export const workoutExerciseInputQueryDtoSchema = z.object({
  exerciseId: idSchema,
  sets: z.array(numberSchema),
  orderIndex: numberSchema,
});

const workoutSplitInputBaseQueryDtoSchema = z.object({
  name: textSchema.min(1, 'Split name is required'),
  orderIndex: z.number().int().nonnegative(),
  exercises: z.array(workoutExerciseInputQueryDtoSchema).min(1, 'Each split must include at least one exercise'),
});

/** Split input used while saving a plan. An omitted ID creates a new split. */
export const saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: idSchema.optional(),
});

export const saveWorkoutSplitPayloadQueryDtoSchema = z.array(saveWorkoutSplitInputQueryDtoSchema).min(1, 'Workout must include at least one split');

/** Exercise assignment included in a complete workout-plan query. */
export const exerciseInPlanQueryDtoSchema = z.object({
  exerciseToSplitId: idSchema,
  exerciseId: idSchema,
  name: textSchema,
  sets: z.array(
    z.object({
      orderIndex: numberSchema,
      reps: numberSchema,
    }),
  ),
  orderIndex: numberSchema,
  isActive: booleanSchema,
  targetMuscle: textSchema,
  specificTargetMuscle: textSchema,
});
/** Workout split included in a complete workout-plan query. */
export const workoutSplitQueryDtoSchema = z.object({
  id: idSchema,
  workoutId: idSchema,
  name: textSchema,
  orderIndex: numberSchema,
  createdAt: serializedDateSchema,
  muscleGroup: z.string().nullable(),
  estimatedDurationMinutes: z.number().nullable(),
  isActive: booleanSchema,
  exercises: z.array(exerciseInPlanQueryDtoSchema),
});
/** Complete active workout plan returned for a user. */
export const wholeUserWorkoutPlanQueryDtoSchema = z.object({
  id: idSchema,
  numberOfSplits: z.number(),
  createdAt: serializedDateSchema,
  userId: uuidSchema,
  isActive: booleanSchema,
  updatedAt: serializedDateSchema,
  workoutSplits: z.array(workoutSplitQueryDtoSchema).nullable(),
});

// SQL query DTO types

export type WorkoutExerciseInputQueryDto = z.infer<typeof workoutExerciseInputQueryDtoSchema>;
export type SaveWorkoutSplitInputQueryDto = z.infer<typeof saveWorkoutSplitInputQueryDtoSchema>;
export type ExerciseInPlanQueryDto = z.infer<typeof exerciseInPlanQueryDtoSchema>;
export type WorkoutSplitQueryDto = z.infer<typeof workoutSplitQueryDtoSchema>;
export type WholeUserWorkoutPlanQueryDto = z.infer<typeof wholeUserWorkoutPlanQueryDtoSchema>;

// SQL query input DTOs

export type SaveWorkoutSplitPayloadQueryDto = z.infer<typeof saveWorkoutSplitPayloadQueryDtoSchema>;
