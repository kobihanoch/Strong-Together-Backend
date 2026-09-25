import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
const idSchema = z.number().int().positive();
const uuidSchema = z.string().uuid();
const textSchema = z.string();
const booleanSchema = z.boolean();
const numberSchema = z.number().finite();
const orderIndexSchema = z.number().int().nonnegative();
const repetitionsSchema = z.number().int().min(1).max(10_000);

/** Exercise input stored while adding a workout plan. */
export const workoutExerciseInputQueryDtoSchema = z.object({
  exerciseId: idSchema,
  sets: z.array(repetitionsSchema).min(1, 'Each exercise must include at least one set').max(100, 'An exercise cannot include more than 100 sets'),
  orderIndex: orderIndexSchema,
});

const workoutSplitInputBaseQueryDtoSchema = z.object({
  name: textSchema.trim().min(1, 'Split name is required').max(100, 'Split name must be at most 100 characters'),
  orderIndex: orderIndexSchema,
  exercises: z
    .array(workoutExerciseInputQueryDtoSchema)
    .min(1, 'Each split must include at least one exercise')
    .max(100, 'A split cannot include more than 100 exercises')
    .superRefine((exercises, context) => {
      const exerciseIds = new Set<number>();
      const orderIndexes = new Set<number>();
      exercises.forEach((exercise, index) => {
        if (exerciseIds.has(exercise.exerciseId))
          context.addIssue({ code: 'custom', path: [index, 'exerciseId'], message: 'Exercise IDs must be unique within a split' });
        if (orderIndexes.has(exercise.orderIndex))
          context.addIssue({ code: 'custom', path: [index, 'orderIndex'], message: 'Exercise order indexes must be unique within a split' });
        exerciseIds.add(exercise.exerciseId);
        orderIndexes.add(exercise.orderIndex);
      });
    }),
});

/** Split input used while saving a plan. An omitted ID creates a new split. */
export const saveWorkoutSplitInputQueryDtoSchema = workoutSplitInputBaseQueryDtoSchema.extend({
  id: idSchema.optional(),
});

export const saveWorkoutSplitPayloadQueryDtoSchema = z
  .array(saveWorkoutSplitInputQueryDtoSchema)
  .min(1, 'Workout must include at least one split')
  .max(20, 'A workout cannot include more than 20 splits')
  .superRefine((splits, context) => {
    const ids = new Set<number>();
    const orderIndexes = new Set<number>();
    splits.forEach((split, index) => {
      if (split.id !== undefined) {
        if (ids.has(split.id)) context.addIssue({ code: 'custom', path: [index, 'id'], message: 'Workout split IDs must be unique' });
        ids.add(split.id);
      }
      if (orderIndexes.has(split.orderIndex))
        context.addIssue({ code: 'custom', path: [index, 'orderIndex'], message: 'Workout split order indexes must be unique' });
      orderIndexes.add(split.orderIndex);
    });
  });

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

/** Represents the workout exercise input query dto value. */
export type WorkoutExerciseInputQueryDto = z.infer<typeof workoutExerciseInputQueryDtoSchema>;
/** Represents the save workout split input query dto value. */
export type SaveWorkoutSplitInputQueryDto = z.infer<typeof saveWorkoutSplitInputQueryDtoSchema>;
/** Represents the exercise in plan query dto value. */
export type ExerciseInPlanQueryDto = z.infer<typeof exerciseInPlanQueryDtoSchema>;
/** Represents the workout split query dto value. */
export type WorkoutSplitQueryDto = z.infer<typeof workoutSplitQueryDtoSchema>;
/** Represents the whole user workout plan query dto value. */
export type WholeUserWorkoutPlanQueryDto = z.infer<typeof wholeUserWorkoutPlanQueryDtoSchema>;

// SQL query input DTOs

/** Represents the save workout split payload query dto value. */
export type SaveWorkoutSplitPayloadQueryDto = z.infer<typeof saveWorkoutSplitPayloadQueryDtoSchema>;
