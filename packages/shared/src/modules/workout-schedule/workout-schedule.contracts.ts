import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { serializedDateSchema } from '../../common';

const workoutScheduleInputSchema = z.object({
  workoutSplitId: z.number().int().positive(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
});

const workoutScheduleSchema = workoutScheduleInputSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  startTime: z.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
});

export const getWorkoutSchedulesResponseSchema = z.object({
  schedules: z.array(workoutScheduleSchema),
});

export const getWorkoutSchedulesContract = {
  response: getWorkoutSchedulesResponseSchema,
} satisfies Contract;

export const replaceWorkoutSchedulesRequestSchema = z.object({
  body: z.object({
    schedules: z.array(workoutScheduleInputSchema).max(140, 'A weekly schedule cannot contain more than 140 entries').superRefine((schedules, context) => {
      const keys = new Set<string>();
      for (const schedule of schedules) {
        const key = `${schedule.workoutSplitId}:${schedule.dayOfWeek}`;
        if (keys.has(key)) {
          context.addIssue({ code: 'custom', message: 'A workout split can only be scheduled once per weekday' });
        }
        keys.add(key);
      }
    }),
  }),
});

export const replaceWorkoutSchedulesContract = {
  request: replaceWorkoutSchedulesRequestSchema,
  response: z.void(),
} satisfies Contract;

/** Represents the get workout schedules response value. */
export type GetWorkoutSchedulesResponse = ResponseOf<typeof getWorkoutSchedulesContract>;
/** Represents the replace workout schedules body value. */
export type ReplaceWorkoutSchedulesBody = BodyOf<typeof replaceWorkoutSchedulesContract>;
/** Represents the replace workout schedules response value. */
export type ReplaceWorkoutSchedulesResponse = ResponseOf<typeof replaceWorkoutSchedulesContract>;
