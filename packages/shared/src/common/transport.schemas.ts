import { z } from 'zod/v4';

/** ISO or PostgreSQL-rendered timestamp transported as JSON text. */
export const serializedDateSchema = z.string();

/** Valid IANA timezone identifier accepted at API boundaries. */
export const timezoneSchema = z.string().refine(
  (timeZone) => {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone }).format();
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Time zone must be a valid IANA time zone' },
);
