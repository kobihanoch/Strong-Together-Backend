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
const trackedSetQueryDtoSchema = z.object({
  reps: trackingSetDbSchema.shape.reps,
  weight: trackingSetDbSchema.shape.weight,
  setIndex: trackingSetDbSchema.shape.setIndex,
});

const finishedWorkoutEntryBaseQueryDtoSchema = z.object({
  trackedSets: z.array(trackedSetQueryDtoSchema),
  notes: exerciseTrackingDbSchema.shape.notes.optional(),
});

export const finishedWorkoutEntryQueryDtoSchema = finishedWorkoutEntryBaseQueryDtoSchema.extend({
  isExerciseAssignedToSplit: z.boolean(),
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseTrackingDbSchema.shape.exerciseId,
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
const groupedTrackingItemQueryDtoSchema = z.object({
  exerciseTracking: z.object({
    exerciseTrackingId: exerciseTrackingDbSchema.shape.id,
    sets: z.array(z.object({
      setIndex: trackingSetDbSchema.shape.setIndex,
      weight: trackingSetDbSchema.shape.weight,
      reps: trackingSetDbSchema.shape.reps,
    })),
    notes: exerciseTrackingDbSchema.shape.notes,
    exerciseAssignment: z.object({
      exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
      orderIndex: exerciseToWorkoutSplitDbSchema.shape.orderIndex.nullable(),
      exerciseId: exerciseDbSchema.shape.id,
      workoutSplitId: workoutSplitDbSchema.shape.id,
      workoutSplitName: workoutSplitDbSchema.shape.name,
      exerciseName: exerciseDbSchema.shape.name,
      targetMuscle: exerciseDbSchema.shape.targetMuscle,
      specificTargetMuscle: exerciseDbSchema.shape.specificTargetMuscle,
    }),
  }),
});

const trackingByExerciseToSplitIdItemQueryDtoSchema = groupedTrackingItemQueryDtoSchema.shape.exerciseTracking
  .omit({ notes: true })
  .extend({ workoutStartLocal: serializedDateSchema });

export const personalRecordQueryDtoSchema = z.object({
  exerciseToSplitId: exerciseTrackingDbSchema.shape.exerciseToSplitId,
  exerciseId: exerciseDbSchema.shape.id,
  exerciseName: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight,
  prReps: trackingSetDbSchema.shape.reps,
  prSetIndex: trackingSetDbSchema.shape.setIndex,
  estimatedOneRepMax: z.number().nullable(),
});

export const personalRecordsQueryDtoSchema = z.object({
  prs: z.record(z.string(), personalRecordQueryDtoSchema.omit({ exerciseId: true })),
});

export const exerciseTrackingStatsQueryDtoSchema = z.object({
  workoutCount: z.coerce.number(),
  hasExerciseTracking: z.boolean(),
  nextWorkoutSplit: z
    .object({
      id: workoutSplitDbSchema.shape.id,
      name: workoutSplitDbSchema.shape.name,
      orderIndex: workoutSplitDbSchema.shape.orderIndex,
      muscleGroup: z.string().nullable(),
    })
    .nullable(),
  workoutTargets: z.object({
    workoutCountThisWeek: z.coerce.number(),
    workoutCountScheduledPerWeek: z.coerce.number(),
    weekStreak: z.coerce.number(),
  }),
  lastWorkoutStats: z.object({
    workoutDate: z.string().nullable(),
    workoutSplitName: workoutSplitDbSchema.shape.name.nullable(),
    exerciseTrackedCount: z.coerce.number().nullable(),
    setTrackedCount: z.coerce.number().nullable(),
  }),
  latestPr: z.array(personalRecordQueryDtoSchema).max(1),
});

export const exerciseTrackingMapsQueryDtoSchema = z.object({
  byDate: z.record(
    z.string(),
    z.object({
      durationMins: z.number(),
      exerciseTracked: z.array(groupedTrackingItemQueryDtoSchema),
    }),
  ),
});

export const exerciseHistoryQueryDtoSchema = z.object({
  byExerciseToSplitId: z.record(
    z.string(),
    z.object({
      exerciseTracked: z.array(trackingByExerciseToSplitIdItemQueryDtoSchema),
    }),
  ),
});

export const exerciseTrackingAndStatsQueryDtoSchema = z.object({
  trackingStats: exerciseTrackingStatsQueryDtoSchema,
  trackingMaps: exerciseTrackingMapsQueryDtoSchema,
});

/** SQL row wrapping the complete tracking aggregate under `data`. */
export const exerciseTrackingAndStatsRowQueryDtoSchema = z.object({ data: exerciseTrackingAndStatsQueryDtoSchema });
export const exerciseTrackingStatsRowQueryDtoSchema = z.object({ data: exerciseTrackingStatsQueryDtoSchema });
export const exerciseTrackingMapsRowQueryDtoSchema = z.object({ data: exerciseTrackingMapsQueryDtoSchema });
export const exerciseHistoryRowQueryDtoSchema = z.object({ data: exerciseHistoryQueryDtoSchema });
export const personalRecordsRowQueryDtoSchema = z.object({ data: personalRecordsQueryDtoSchema });

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
export type ExerciseTrackingStatsQueryDto = z.infer<typeof exerciseTrackingStatsQueryDtoSchema>;
export type ExerciseTrackingStatsRowQueryDto = z.infer<typeof exerciseTrackingStatsRowQueryDtoSchema>;
export type ExerciseTrackingMapsQueryDto = z.infer<typeof exerciseTrackingMapsQueryDtoSchema>;
export type ExerciseTrackingMapsRowQueryDto = z.infer<typeof exerciseTrackingMapsRowQueryDtoSchema>;
export type ExerciseHistoryQueryDto = z.infer<typeof exerciseHistoryQueryDtoSchema>;
export type ExerciseHistoryRowQueryDto = z.infer<typeof exerciseHistoryRowQueryDtoSchema>;
export type PersonalRecordsQueryDto = z.infer<typeof personalRecordsQueryDtoSchema>;
export type PersonalRecordsRowQueryDto = z.infer<typeof personalRecordsRowQueryDtoSchema>;
export type WorkoutSplitLookupQueryDto = z.infer<typeof workoutSplitLookupQueryDtoSchema>;
export type WorkoutSummaryIdQueryDto = z.infer<typeof workoutSummaryIdQueryDtoSchema>;
export type ExerciseTrackingIdQueryDto = z.infer<typeof exerciseTrackingIdQueryDtoSchema>;

// SQL query input DTOs

export type FinishedWorkoutEntryQueryDto = z.infer<typeof finishedWorkoutEntryQueryDtoSchema>;
