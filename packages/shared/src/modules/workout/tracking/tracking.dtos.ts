import { z } from 'zod/v4';
import {
  exerciseTrackingAnalysisSchema,
  exerciseTrackingAndStatsSchema,
  finishWorkoutRequest,
  trackingMapItemSchema,
} from './tracking.schemas';

export type ExerciseTrackingAnalysis = z.infer<typeof exerciseTrackingAnalysisSchema>;
export type TrackingMapItem = z.infer<typeof trackingMapItemSchema>;
export type ExerciseTrackingAndStats = z.infer<typeof exerciseTrackingAndStatsSchema>;
export type FinishedWorkoutEntry = z.infer<typeof finishWorkoutRequest.shape.body.shape.workout.element>;
