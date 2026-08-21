import { z } from 'zod/v4';
import type { Contract, QueryOf, ResponseOf } from '../../common';
import { userAerobicsResponseSchema } from '../aerobics/aerobics.contracts';
import { getAllUserMessagesResponseSchema } from '../messages/messages.contracts';
import { userDataQueryDtoSchema } from '../user/update/update.dtos';
import { getWholeUserWorkoutPlanResponseSchema } from '../workout/plan/plan.contracts';
import { exerciseTrackingAndStatsQueryDtoSchema } from '../workout/tracking/tracking.dtos';

// Bootstrap application

export const bootstrapRequestSchema = z.object({ query: z.object({ tz: z.string().optional() }) });
export const bootstrapResponseSchema = z.object({
  user: userDataQueryDtoSchema,
  workout: getWholeUserWorkoutPlanResponseSchema,
  tracking: exerciseTrackingAndStatsQueryDtoSchema,
  messages: getAllUserMessagesResponseSchema,
  aerobics: userAerobicsResponseSchema,
});

export const bootstrapContract = {
  request: bootstrapRequestSchema,
  response: bootstrapResponseSchema,
} satisfies Contract;

export type BootstrapRequestQuery = QueryOf<typeof bootstrapContract>;
export type BootstrapResponse = ResponseOf<typeof bootstrapContract>;
