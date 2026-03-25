import z from 'zod';
import { getAnalyticsResponseSchema } from '../../../validators/analytics/getAnalyticsResponse.schema.ts';

export type GetAnalyticsResponse = z.infer<typeof getAnalyticsResponseSchema>;
