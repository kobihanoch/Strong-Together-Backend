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
  id: exerciseDbSchema.shape.id,
  sets: z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
});

/** Workout split payload accepted by the add-workout SQL workflow. */
export const addWorkoutSplitPayloadQueryDtoSchema = z.record(
  z.string(),
  z.array(workoutExerciseInputQueryDtoSchema).min(1, 'Each split must include at least one exercise'),
);

/** Exercise assignment included in a complete workout-plan query. */
export const exerciseInPlanQueryDtoSchema = z.object({
  id: exerciseToWorkoutSplitDbSchema.shape.id,
  sets: z.array(workoutSetDbSchema.shape.reps),
  isActive: exerciseToWorkoutSplitDbSchema.shape.isActive,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
  exercise: exerciseDbSchema.shape.name,
  workoutSplit: workoutSplitDbSchema.shape.name,
});
/** Workout split included in a complete workout-plan query. */
export const workoutSplitQueryDtoSchema = z.object({
  id: workoutSplitDbSchema.shape.id,
  workoutId: workoutSplitDbSchema.shape.workoutId,
  name: workoutSplitDbSchema.shape.name,
  createdAt: serializedDateSchema,
  muscleGroup: z.string().nullable(),
  isActive: workoutSplitDbSchema.shape.isActive,
  exerciseToWorkoutSplit: z.array(exerciseInPlanQueryDtoSchema),
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
/** Exercise item included in the editable workout-split map. */
export const workoutSplitsMapItemQueryDtoSchema = z.object({
  id: exerciseDbSchema.shape.id,
  name: exerciseDbSchema.shape.name,
  sets: z.array(workoutSetDbSchema.shape.reps),
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});
/** Target-muscle metadata selected for an editable workout exercise. */
export const workoutExerciseMetadataQueryDtoSchema = workoutSplitsMapItemQueryDtoSchema.pick({
  targetMuscle: true,
  specificTargetMuscle: true,
});
/** Editable workout-plan map grouped by split name. */
export const workoutSplitsMapQueryDtoSchema = z.record(z.string(), z.array(workoutSplitsMapItemQueryDtoSchema));

/** SQL row wrapping the editable workout split map under `splits`. */
export const workoutSplitsRowQueryDtoSchema = z.object({ splits: workoutSplitsMapQueryDtoSchema });

/** SQL row returned when inserting or retrieving a workout plan. */
export const workoutPlanIdQueryDtoSchema = z.object({ id: workoutPlanDbSchema.shape.id });

/** SQL row returned when inserting or reactivating a workout split. */
export const workoutSplitIdQueryDtoSchema = z.object({ id: workoutSplitDbSchema.shape.id });

/** SQL row returned when inserting or reactivating an exercise assignment. */
export const exerciseAssignmentIdQueryDtoSchema = z.object({ id: exerciseToWorkoutSplitDbSchema.shape.id });

// SQL query DTO types

export type WorkoutExerciseInputQueryDto = z.infer<typeof workoutExerciseInputQueryDtoSchema>;
export type ExerciseInPlanQueryDto = z.infer<typeof exerciseInPlanQueryDtoSchema>;
export type WorkoutSplitQueryDto = z.infer<typeof workoutSplitQueryDtoSchema>;
export type WorkoutSplitsMapItemQueryDto = z.infer<typeof workoutSplitsMapItemQueryDtoSchema>;
export type WorkoutExerciseMetadataQueryDto = z.infer<typeof workoutExerciseMetadataQueryDtoSchema>;
export type WholeUserWorkoutPlanQueryDto = z.infer<typeof wholeUserWorkoutPlanQueryDtoSchema>;

// SQL query input DTOs

export type AddWorkoutSplitPayloadQueryDto = z.infer<typeof addWorkoutSplitPayloadQueryDtoSchema>;
export type WorkoutSplitsMapQueryDto = z.infer<typeof workoutSplitsMapQueryDtoSchema>;
export type WorkoutSplitsRowQueryDto = z.infer<typeof workoutSplitsRowQueryDtoSchema>;
export type WorkoutPlanIdQueryDto = z.infer<typeof workoutPlanIdQueryDtoSchema>;
export type WorkoutSplitIdQueryDto = z.infer<typeof workoutSplitIdQueryDtoSchema>;
export type ExerciseAssignmentIdQueryDto = z.infer<typeof exerciseAssignmentIdQueryDtoSchema>;
