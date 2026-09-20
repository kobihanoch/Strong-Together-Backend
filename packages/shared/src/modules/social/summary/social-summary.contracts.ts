import { z } from 'zod/v4';
import type { Contract, ResponseOf } from '../../../common';

/** Validates the public profile fields shown in the social summary. */
export const socialSummaryParticipantPreviewSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  fullName: z.string(),
  profilePicPath: z.string().nullable(),
});

/** Validates the authenticated user's social summary. */
export const getSocialSummaryResponseSchema = z.object({
  activeCrewCount: z.number().int().nonnegative(),
  participantPreviews: socialSummaryParticipantPreviewSchema.array().max(3),
});

/** Defines the response contract for retrieving the authenticated user's social summary. */
export const getSocialSummaryContract = { response: getSocialSummaryResponseSchema } satisfies Contract;

/** Social summary containing the caller's active crew total and up to three unique co-members. */
export type GetSocialSummaryResponse = ResponseOf<typeof getSocialSummaryContract>;
