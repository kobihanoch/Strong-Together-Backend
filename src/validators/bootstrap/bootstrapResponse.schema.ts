import { z } from 'zod';
import { userDataSchema, exerciseTrackingAndStatsSchema, userAerobicsResponseSchema } from '../shared/responseSchemas.ts';
import { getAllUserMessagesResponseSchema } from '../messages/getAllUserMessagesResponse.schema.ts';
import { getWholeUserWorkoutPlanResponseSchema } from '../workouts/getWholeUserWorkoutPlanResponse.schema.ts';

export const bootstrapResponseSchema = z.object({
  user: userDataSchema,
  workout: getWholeUserWorkoutPlanResponseSchema,
  tracking: exerciseTrackingAndStatsSchema,
  messages: getAllUserMessagesResponseSchema,
  aerobics: userAerobicsResponseSchema,
});
