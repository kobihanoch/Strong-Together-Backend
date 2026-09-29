import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../../common';

/** Public crew invitation or join-request representation. */
export const crewParticipationRequestSchema = z.object({
  id: z.string().uuid(),
  crewId: z.string().uuid(),
  initiatorUserId: z.string().uuid(),
  participantUserId: z.string().uuid(),
  status: z.enum(['pending', 'accepted', 'declined', 'cancelled', 'expired']),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  respondedAt: serializedDateSchema.nullable(),
});
