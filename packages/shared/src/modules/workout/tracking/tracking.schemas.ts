import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import {
  exerciseDbSchema,
  exerciseToWorkoutSplitDbSchema,
  exerciseTrackingDbSchema,
  trackingSetDbSchema,
  workoutSetDbSchema,
  workoutSplitDbSchema,
} from '../../../database';

const finishedExerciseEntry = z.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: z.array(trackingSetDbSchema.shape.weight),
  reps: z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes.optional(),
});

export const exerciseMetadataSchema = z.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});

export const exerciseTrackingPrMaxSchema = z.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema,
});

export const exerciseTrackingAnalysisSchema = z.object({
  uniqueDays: z.number(),
  mostFrequentSplit: z.string().nullable(),
  mostFrequentSplitDays: z.number().nullable(),
  lastWorkoutDate: z.string().nullable(),
  splitDaysByName: z.record(z.string(), z.number()),
  prs: z.object({
    prMax: exerciseTrackingPrMaxSchema.nullable(),
  }),
});

export const trackingMapItemSchema = z.object({
  id: exerciseTrackingDbSchema.shape.id,
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: z.array(trackingSetDbSchema.shape.weight),
  reps: z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes,
  exerciseId: exerciseDbSchema.shape.id,
  workoutSplitId: workoutSplitDbSchema.shape.id,
  splitName: workoutSplitDbSchema.shape.name,
  exercise: exerciseDbSchema.shape.name,
  workoutDate: serializedDateSchema,
  orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex,
  exerciseToWorkoutSplit: z.object({
    sets: z.array(workoutSetDbSchema.shape.reps),
    exercises: exerciseMetadataSchema,
  }),
});

export const trackingByDateItemSchema = trackingMapItemSchema.omit({ workoutDate: true });
export const trackingBySplitNameItemSchema = trackingMapItemSchema.omit({ splitName: true });

export const exerciseTrackingAndStatsSchema = z.object({
  exerciseTrackingAnalysis: exerciseTrackingAnalysisSchema,
  exerciseTrackingMaps: z.object({
    byDate: z.record(z.string(), z.array(trackingByDateItemSchema)),
    byExerciseToSplitId: z.record(z.string(), z.array(trackingMapItemSchema)),
    bySplitName: z.record(z.string(), z.array(trackingBySplitNameItemSchema)),
  }),
});

export const finishWorkoutRequest = z.object({
  body: z.object({
    workout: z.array(finishedExerciseEntry),
    tz: z.string().optional(),
    workoutStartUtc: z.string().datetime('workoutStartUtc must be a valid ISO datetime'),
    workoutEndUtc: z.string().datetime('workoutEndUtc must be a valid ISO datetime').optional().nullable(),
  }),
});

export const finishUserWorkoutResponseSchema = exerciseTrackingAndStatsSchema;

export const getExerciseTrackingRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export const getExerciseTrackingResponseSchema = exerciseTrackingAndStatsSchema;
