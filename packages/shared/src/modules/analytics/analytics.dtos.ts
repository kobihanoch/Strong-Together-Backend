import { z } from 'zod/v4';
import { exerciseDbSchema, trackingSetDbSchema } from '../../database';

/** One-repetition-maximum record produced for one exercise. */
export const workoutRmRecordQueryDtoSchema = z.object({
  exercise: exerciseDbSchema.shape.name,
  prWeight: trackingSetDbSchema.shape.weight.nullable(),
  prReps: trackingSetDbSchema.shape.reps.nullable(),
  max1Rm: z.number(),
});
/** Planned-versus-actual adherence record produced for one exercise. */
export const adherenceExerciseStatsQueryDtoSchema = z.object({
  planned: z.number(),
  actual: z.number(),
  adherencePct: z.number().nullable(),
});

/** Complete one-repetition-maximum map returned by its SQL query. */
export const workoutRmsQueryDtoSchema = z.record(z.string(), workoutRmRecordQueryDtoSchema);

/** SQL row wrapping the one-repetition-maximum map under `result`. */
export const workoutRmsRowQueryDtoSchema = z.object({ result: workoutRmsQueryDtoSchema });

/** Complete goal-adherence map returned by its SQL query. */
export const goalAdherenceQueryDtoSchema = z.record(
  z.string(),
  z.record(z.string(), adherenceExerciseStatsQueryDtoSchema),
);

/** SQL row wrapping the goal-adherence map under `result`. */
export const goalAdherenceRowQueryDtoSchema = z.object({ result: goalAdherenceQueryDtoSchema });
export type WorkoutRmRecordQueryDto = z.infer<typeof workoutRmRecordQueryDtoSchema>;
export type WorkoutRmsQueryDto = z.infer<typeof workoutRmsQueryDtoSchema>;
export type WorkoutRmsRowQueryDto = z.infer<typeof workoutRmsRowQueryDtoSchema>;
export type AdherenceExerciseStatsQueryDto = z.infer<typeof adherenceExerciseStatsQueryDtoSchema>;
export type GoalAdherenceQueryDto = z.infer<typeof goalAdherenceQueryDtoSchema>;
export type GoalAdherenceRowQueryDto = z.infer<typeof goalAdherenceRowQueryDtoSchema>;
