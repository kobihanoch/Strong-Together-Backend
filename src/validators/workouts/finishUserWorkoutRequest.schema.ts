import { z } from 'zod';

const finishedExerciseEntry = z.object({
  exercisetosplit_id: z.number(),
  weight: z.array(z.number()),
  reps: z.array(z.number()),
  notes: z.string().optional().nullable(),
});

export const finishWorkoutRequest = z.object({
  body: z.object({
    workout: z.array(finishedExerciseEntry),
    tz: z.string().optional(),
    workout_start_utc: z.string().optional().nullable(),
    workout_end_utc: z.string().optional().nullable(),
  }),
});
