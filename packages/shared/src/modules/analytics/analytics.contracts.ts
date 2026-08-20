import z from 'zod/v4';
import { getAnalyticsResponseSchema } from './analytics.schemas';

export type GetAnalyticsResponse = z.infer<typeof getAnalyticsResponseSchema>;
