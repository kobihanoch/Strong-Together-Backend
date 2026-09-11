import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { crewDbSchema, crewMembershipDbSchema, userDbSchema } from '../../../database';

/** Runtime schema for a crew row returned by the social crew queries. */
export const crewQueryDtoSchema = crewDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
});

/** Runtime schema for the limited participant preview shown during crew discovery. */
export const crewParticipantPreviewQueryDtoSchema = z.object({
  username: userDbSchema.shape.username,
  fullName: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath,
});

/** Runtime schema for a discoverable crew and its five-participant preview. */
export const discoverableCrewQueryDtoSchema = crewQueryDtoSchema.extend({
  top5Participants: crewParticipantPreviewQueryDtoSchema.array(),
});

/** Runtime schema for an active crew participant and their public profile data. */
export const crewParticipantQueryDtoSchema = crewMembershipDbSchema.extend({
  joinedAt: serializedDateSchema,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
});

/** Runtime schema for a crew deletion result. */
export const deletedCrewQueryDtoSchema = z.object({ id: crewDbSchema.shape.id });

/** Runtime schema for the outcome returned by the leave-crew query. */
export const leaveCrewResultQueryDtoSchema = z.object({
  result: z.enum(['left', 'not_member']),
});

/** Runtime schema for the locked active membership being left. */
export const leaveCrewContextQueryDtoSchema = z.object({
  membershipId: crewMembershipDbSchema.shape.id,
});

/** Runtime schema for the participant selected to succeed a leaving leader. */
export const crewSuccessorQueryDtoSchema = z.object({
  membershipId: crewMembershipDbSchema.shape.id,
  userId: crewMembershipDbSchema.shape.userId,
});

/** Typed crew row returned by crew SELECT, INSERT, and UPDATE queries. */
export type CrewQueryDto = typeof crewQueryDtoSchema._output;

/** Public participant information included in a crew discovery result. */
export type CrewParticipantPreviewQueryDto = typeof crewParticipantPreviewQueryDtoSchema._output;

/** Typed crew discovery row returned by the security-definer function. */
export type DiscoverableCrewQueryDto = typeof discoverableCrewQueryDtoSchema._output;

/** Typed active participant returned by the crew-participants query. */
export type CrewParticipantQueryDto = typeof crewParticipantQueryDtoSchema._output;

/** Typed result used to verify that a crew was deleted. */
export type DeletedCrewQueryDto = typeof deletedCrewQueryDtoSchema._output;

/** Typed outcome returned after attempting to leave a crew. */
export type LeaveCrewResultQueryDto = typeof leaveCrewResultQueryDtoSchema._output;

/** Typed locked membership used by the leave workflow. */
export type LeaveCrewContextQueryDto = typeof leaveCrewContextQueryDtoSchema._output;

/** Typed active participant selected as the next crew leader. */
export type CrewSuccessorQueryDto = typeof crewSuccessorQueryDtoSchema._output;
