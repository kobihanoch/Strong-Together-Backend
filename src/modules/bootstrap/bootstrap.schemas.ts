import { z } from 'zod';
import { userAerobicsResponseSchema } from '../aerobics/aerobics.schemas.ts';
import { getAllUserMessagesResponseSchema } from '../messages/messages.schemas.ts';
import { userDataSchema } from '../user/update/update.schemas.ts';
import { getWholeUserWorkoutPlanResponseSchema } from '../workout/plan/plan.schemas.ts';
import { exerciseTrackingAndStatsSchema } from '../workout/tracking/tracking.schemas.ts';

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
