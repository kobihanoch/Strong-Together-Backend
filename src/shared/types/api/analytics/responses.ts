import z from 'zod';
import { getAnalyticsResponseSchema } from '../../../../modules/analytics/analytics.schemas.ts';

export type GetAnalyticsResponse = z.infer<typeof getAnalyticsResponseSchema>;
