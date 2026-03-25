import { z } from 'zod';

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

export const exerciseMetadataSchema = z.object({
  targetmuscle: z.string(),
  specifictargetmuscle: z.string(),
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

export const userDataSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  name: z.string(),
  gender: z.string(),
  created_at: z.string(),
  profile_image_url: z.string().nullable(),
  push_token: z.string().nullable(),
  role: z.string(),
  is_first_login: z.boolean(),
  token_version: z.number(),
  is_verified: z.boolean(),
  auth_provider: z.string(),
});

export const createUserUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  gender: z.string(),
  role: z.string(),
  created_at: z.string(),
});

export const allUserMessageSchema = z.object({
  id: z.string(),
  subject: z.string(),
  msg: z.string(),
  sent_at: z.string(),
  is_read: z.boolean(),
  sender_full_name: z.string(),
  sender_profile_image_url: z.string().nullable(),
});

export const messageAsReadSchema = z.object({
  id: z.string(),
  is_read: z.boolean(),
});

export const deletedMessageSchema = z.object({
  id: z.string(),
});

export const exerciseTrackingPrMaxSchema = z.object({
  exercise: z.string(),
  weight: z.number(),
  reps: z.number(),
  workout_time_utc: z.string(),
});

export const exerciseTrackingAnalysisSchema = z.object({
  unique_days: z.number(),
  most_frequent_split: z.string().nullable(),
  most_frequent_split_days: z.number().nullable(),
  lastWorkoutDate: z.string().nullable(),
  splitDaysByName: z.record(z.string(), z.number()),
  prs: z.object({
    pr_max: exerciseTrackingPrMaxSchema.nullable(),
  }),
});

export const trackingMapItemSchema = z.object({
  id: z.number(),
  exercisetosplit_id: z.number(),
  weight: z.array(z.number()),
  reps: z.array(z.number()),
  notes: z.string().nullable(),
  exercise_id: z.number(),
  workoutsplit_id: z.number(),
  splitname: z.string(),
  exercise: z.string(),
  workoutdate: z.string(),
  order_index: z.number(),
  exercisetoworkoutsplit: z.object({
    sets: z.array(z.number()),
    exercises: exerciseMetadataSchema,
  }),
});

export const trackingByDateItemSchema = trackingMapItemSchema.omit({ workoutdate: true });
export const trackingBySplitNameItemSchema = trackingMapItemSchema.omit({ splitname: true });

export const exerciseTrackingAndStatsSchema = z.object({
  exerciseTrackingAnalysis: exerciseTrackingAnalysisSchema,
  exerciseTrackingMaps: z.object({
    byDate: z.record(z.string(), z.array(trackingByDateItemSchema)),
    byETSId: z.record(z.number(), z.array(trackingMapItemSchema)),
    bySplitName: z.record(z.string(), z.array(trackingBySplitNameItemSchema)),
  }),
});

export const workoutRmRecordSchema = z.object({
  exercise: z.string(),
  pr_weight: z.number().nullable(),
  pr_reps: z.number().nullable(),
  max_1rm: z.number(),
});

export const adherenceExerciseStatsSchema = z.object({
  planned: z.number(),
  actual: z.number(),
  adherence_pct: z.number().nullable(),
});

export const aerobicsDailyRecordSchema = z.object({
  type: z.string(),
  duration_sec: z.number(),
  duration_mins: z.number(),
});

export const aerobicsWeeklyRecordSchema = aerobicsDailyRecordSchema.extend({
  workout_time_utc: z.string(),
});

export const weeklyDataSchema = z.object({
  records: z.array(aerobicsWeeklyRecordSchema),
  total_duration_sec: z.number(),
  total_duration_mins: z.number(),
});

export const userAerobicsResponseSchema = z.object({
  daily: z.record(z.string(), z.array(aerobicsDailyRecordSchema)),
  weekly: z.record(z.string(), weeklyDataSchema),
});

export const getAllExercisesResponseSchema = z.record(
  z.string(),
  z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      specificTargetMuscle: z.string(),
    }),
  ),
);

export const getAnalyticsResponseSchema = z.object({
  _1RM: z.record(z.string(), workoutRmRecordSchema),
  goals: z.record(z.string(), z.record(z.string(), adherenceExerciseStatsSchema)),
});
