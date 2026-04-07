import { z } from 'zod';
import { userDataSchema, exerciseTrackingAndStatsSchema, userAerobicsResponseSchema } from '../../validators/shared/responseSchemas.ts';
import { getAllUserMessagesResponseSchema } from '../messages/messages.schemas.ts';
import { getWholeUserWorkoutPlanResponseSchema } from '../workout/plan/plan.schemas.ts';

export const bootstrapRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});

export const bootstrapResponseSchema = z.object({
  user: userDataSchema,
  workout: getWholeUserWorkoutPlanResponseSchema,
  tracking: exerciseTrackingAndStatsSchema,
  messages: getAllUserMessagesResponseSchema,
  aerobics: userAerobicsResponseSchema,
});
