import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../common';
import { workoutScheduleInputDtoSchema, workoutScheduleQueryDtoSchema } from './workout-schedule.dtos';

export const getWorkoutSchedulesResponseSchema = z.object({
  schedules: z.array(workoutScheduleQueryDtoSchema),
});

export const getWorkoutSchedulesContract = {
  response: getWorkoutSchedulesResponseSchema,
} satisfies Contract;

export const replaceWorkoutSchedulesRequestSchema = z.object({
  body: z.object({
    schedules: z.array(workoutScheduleInputDtoSchema).superRefine((schedules, context) => {
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

export type GetWorkoutSchedulesResponse = ResponseOf<typeof getWorkoutSchedulesContract>;
export type ReplaceWorkoutSchedulesBody = BodyOf<typeof replaceWorkoutSchedulesContract>;
export type ReplaceWorkoutSchedulesResponse = ResponseOf<typeof replaceWorkoutSchedulesContract>;
