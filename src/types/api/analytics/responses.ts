import z from 'zod';
import { getAnalyticsResponseSchema } from '../../../features/analytics/getAnalyticsResponse.schema.ts';

export type GetAnalyticsResponse = z.infer<typeof getAnalyticsResponseSchema>;
