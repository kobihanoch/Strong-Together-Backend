import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';

/** Public crew representation used by social HTTP responses. */
export const crewSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdBy: z.string().uuid(),
  privacy: z.enum(['public', 'private']),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
});

/** Runtime schema for a crew returned with its active participant total. */
export const crewWithParticipantCountSchema = crewSchema.extend({
  participantCount: z.number().int().nonnegative(),
});

/** Runtime schema for the limited participant preview shown during crew discovery. */
export const crewParticipantPreviewSchema = z.object({
  username: z.string(),
  fullName: z.string(),
  profilePicPath: z.string().nullable(),
});

/** Runtime schema for a discoverable crew and its five-participant preview. */
export const discoverableCrewSchema = crewWithParticipantCountSchema.extend({
  top5Participants: crewParticipantPreviewSchema.array(),
});

/** Runtime schema for an active crew participant and their public profile data. */
export const crewParticipantSchema = z.object({
  id: z.string().uuid(),
  crewId: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['active', 'left', 'removed', 'banned']),
  role: z.enum(['leader', 'admin', 'member']),
  joinedAt: serializedDateSchema,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  fullName: z.string(),
  profilePicPath: z.string().nullable(),
  username: z.string(),
});
