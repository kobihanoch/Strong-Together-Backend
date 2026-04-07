import { z } from 'zod';

const workoutExerciseSchema = z.object({
  id: z.number(),
  sets: z.array(z.number()),
  order_index: z.number(),
});

export const exerciseInPlanSchema = z.object({
  id: z.number(),
  sets: z.array(z.number()),
  is_active: z.boolean(),
  targetmuscle: z.string(),
  specifictargetmuscle: z.string(),
  exercise: z.string(),
  workoutsplit: z.string(),
});

export const workoutSplitSchema = z.object({
  id: z.number(),
  workout_id: z.number(),
  name: z.string(),
  created_at: z.string(),
  muscle_group: z.string().nullable(),
  is_active: z.boolean(),
  exercisetoworkoutsplit: z.array(exerciseInPlanSchema),
});

export const wholeUserWorkoutPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  numberofsplits: z.number(),
  created_at: z.string(),
  is_deleted: z.boolean(),
  level: z.string(),
  user_id: z.string(),
  trainer_id: z.string(),
  is_active: z.boolean(),
  updated_at: z.string(),
  workoutsplits: z.array(workoutSplitSchema).nullable(),
});

export const workoutSplitsMapItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  sets: z.array(z.number()),
  order_index: z.number(),
  targetmuscle: z.string(),
  specifictargetmuscle: z.string(),
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
