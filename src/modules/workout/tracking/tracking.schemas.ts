import { z } from 'zod';

const finishedExerciseEntry = z.object({
  exercisetosplit_id: z.number(),
  weight: z.array(z.number()),
  reps: z.array(z.number()),
  notes: z.string().optional().nullable(),
});

export const exerciseMetadataSchema = z.object({
  targetmuscle: z.string(),
  specifictargetmuscle: z.string(),
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

export const finishWorkoutRequest = z.object({
  body: z.object({
    workout: z.array(finishedExerciseEntry),
    tz: z.string().optional(),
    workout_start_utc: z.string().datetime('workout_start_utc must be a valid ISO datetime'),
    workout_end_utc: z.string().datetime('workout_end_utc must be a valid ISO datetime').optional().nullable(),
  }),
});

export const finishUserWorkoutResponseSchema = exerciseTrackingAndStatsSchema;

export const getExerciseTrackingRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export const getExerciseTrackingResponseSchema = exerciseTrackingAndStatsSchema;
