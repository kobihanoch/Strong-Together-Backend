import { z } from 'zod/v4';
import { workoutScheduleDbSchema } from '../../database';

export const workoutScheduleInputDtoSchema = z.object({
  workoutSplitId: workoutScheduleDbSchema.shape.workoutSplitId,
  dayOfWeek: workoutScheduleDbSchema.shape.dayOfWeek.int().min(0).max(6),
  startTime: workoutScheduleDbSchema.shape.startTime.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
});

export const workoutScheduleQueryDtoSchema = workoutScheduleDbSchema;

export type WorkoutScheduleInputDto = z.infer<typeof workoutScheduleInputDtoSchema>;
export type WorkoutScheduleQueryDto = z.infer<typeof workoutScheduleQueryDtoSchema>;
