import z from 'zod';

const addAerobicInput = z.object({
  durationMins: z.number(),
  durationSec: z.number(),
  type: z.string(),
});

export const addAerobicsRequest = z.object({
  body: z.object({
    tz: z.string(),
    record: addAerobicInput,
  }),
});
