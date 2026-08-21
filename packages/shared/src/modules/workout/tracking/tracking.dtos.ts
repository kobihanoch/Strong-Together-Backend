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

/** Finished exercise entry consumed by the workout-insertion query. */
export const finishedWorkoutEntryQueryDtoSchema = z.object({
  exerciseToSplitId: exerciseToWorkoutSplitDbSchema.shape.id,
  weight: z.array(trackingSetDbSchema.shape.weight),
  reps: z.array(trackingSetDbSchema.shape.reps),
  notes: exerciseTrackingDbSchema.shape.notes.optional(),
});

/** Target-muscle metadata nested in a tracking-map item. */
export const exerciseMetadataQueryDtoSchema = z.object({
  targetMuscle: exerciseDbSchema.shape.targetMuscle,
  specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
});
/** Personal-record maximum returned by the tracking analysis query. */
export const exerciseTrackingPrMaxQueryDtoSchema = z.object({
  exercise: exerciseDbSchema.shape.name,
  weight: trackingSetDbSchema.shape.weight,
  reps: trackingSetDbSchema.shape.reps,
  workoutTimeUtc: serializedDateSchema,
});
/** Aggregate workout-frequency and personal-record analysis. */
export const exerciseTrackingAnalysisQueryDtoSchema = z.object({
  uniqueDays: z.number(),
  mostFrequentSplit: z.string().nullable(),
  mostFrequentSplitDays: z.number().nullable(),
  lastWorkoutDate: z.string().nullable(),
  splitDaysByName: z.record(z.string(), z.number()),
  prs: z.object({ prMax: exerciseTrackingPrMaxQueryDtoSchema.nullable() }),
});
/** Detailed exercise-tracking item used by each tracking map. */
export const trackingMapItemQueryDtoSchema = z.object({
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
    exercises: exerciseMetadataQueryDtoSchema,
  }),
});
/** Tracking item used in maps already grouped by workout date. */
export const trackingByDateItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({ workoutDate: true });
/** Tracking item used in maps already grouped by workout split name. */
export const trackingBySplitNameItemQueryDtoSchema = trackingMapItemQueryDtoSchema.omit({ splitName: true });
/** Complete tracking and statistics aggregate returned by the tracking query. */
export const exerciseTrackingAndStatsQueryDtoSchema = z.object({
  exerciseTrackingAnalysis: exerciseTrackingAnalysisQueryDtoSchema,
  exerciseTrackingMaps: z.object({
    byDate: z.record(z.string(), z.array(trackingByDateItemQueryDtoSchema)),
    byExerciseToSplitId: z.record(z.string(), z.array(trackingMapItemQueryDtoSchema)),
    bySplitName: z.record(z.string(), z.array(trackingBySplitNameItemQueryDtoSchema)),
  }),
});

/** SQL row wrapping the complete tracking aggregate under `data`. */
export const exerciseTrackingAndStatsRowQueryDtoSchema = z.object({ data: exerciseTrackingAndStatsQueryDtoSchema });

/** SQL row resolving the workout split for an exercise assignment. */
export const workoutSplitLookupQueryDtoSchema = z.object({ workoutSplitId: workoutSplitDbSchema.shape.id });

/** SQL row returned after inserting a workout summary. */
export const workoutSummaryIdQueryDtoSchema = z.object({ id: z.string().uuid() });

/** SQL row returned after inserting an exercise-tracking record. */
export const exerciseTrackingIdQueryDtoSchema = z.object({ id: exerciseTrackingDbSchema.shape.id });

// SQL query DTO types

export type ExerciseTrackingAnalysisQueryDto = z.infer<typeof exerciseTrackingAnalysisQueryDtoSchema>;
export type ExerciseMetadataQueryDto = z.infer<typeof exerciseMetadataQueryDtoSchema>;
export type ExerciseTrackingPrMaxQueryDto = z.infer<typeof exerciseTrackingPrMaxQueryDtoSchema>;
export type TrackingMapItemQueryDto = z.infer<typeof trackingMapItemQueryDtoSchema>;
export type TrackingByDateItemQueryDto = z.infer<typeof trackingByDateItemQueryDtoSchema>;
export type TrackingBySplitNameItemQueryDto = z.infer<typeof trackingBySplitNameItemQueryDtoSchema>;
export type ExerciseTrackingAndStatsQueryDto = z.infer<typeof exerciseTrackingAndStatsQueryDtoSchema>;
export type ExerciseTrackingAndStatsRowQueryDto = z.infer<typeof exerciseTrackingAndStatsRowQueryDtoSchema>;
export type WorkoutSplitLookupQueryDto = z.infer<typeof workoutSplitLookupQueryDtoSchema>;
export type WorkoutSummaryIdQueryDto = z.infer<typeof workoutSummaryIdQueryDtoSchema>;
export type ExerciseTrackingIdQueryDto = z.infer<typeof exerciseTrackingIdQueryDtoSchema>;

// SQL query input DTOs

export type FinishedWorkoutEntryQueryDto = z.infer<typeof finishedWorkoutEntryQueryDtoSchema>;
