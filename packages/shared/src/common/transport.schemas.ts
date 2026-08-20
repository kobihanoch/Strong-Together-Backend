import { z } from 'zod/v4';

/** ISO or PostgreSQL-rendered timestamp transported as JSON text. */
export const serializedDateSchema = z.string();

export const timezoneSchema = z.string();
