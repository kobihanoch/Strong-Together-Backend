import { z } from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { workoutScheduleDbSchema } from '../../database';

export const workoutScheduleInputDtoSchema = z.object({
  workoutSplitId: workoutScheduleDbSchema.shape.workoutSplitId,
  dayOfWeek: workoutScheduleDbSchema.shape.dayOfWeek.int().min(0).max(6),
  startTime: workoutScheduleDbSchema.shape.startTime.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
});

// Database timestamps are Date objects; JSON responses contain ISO strings.
export const workoutScheduleQueryDtoSchema = workoutScheduleDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
});

export type WorkoutScheduleInputDto = z.infer<typeof workoutScheduleInputDtoSchema>;
export type WorkoutScheduleQueryDto = z.infer<typeof workoutScheduleQueryDtoSchema>;
