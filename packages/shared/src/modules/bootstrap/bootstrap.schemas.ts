import { z } from 'zod/v4';
import { userAerobicsResponseSchema } from '../aerobics/aerobics.schemas';
import { getAllUserMessagesResponseSchema } from '../messages/messages.schemas';
import { userDataSchema } from '../user/update/update.schemas';
import { getWholeUserWorkoutPlanResponseSchema } from '../workout/plan/plan.schemas';
import { exerciseTrackingAndStatsSchema } from '../workout/tracking/tracking.schemas';

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
