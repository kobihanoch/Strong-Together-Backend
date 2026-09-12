import { crewParticipationRequestDbSchema } from '../../../../database';
import { serializedDateSchema } from '../../../../common';

/** Runtime schema for a crew invitation or join-request persistence row. */
export const crewParticipationRequestQueryDtoSchema = crewParticipationRequestDbSchema.extend({
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  respondedAt: serializedDateSchema.nullable(),
});

/** Typed participation-request row returned by crew request queries. */
export type CrewParticipationRequestQueryDto = typeof crewParticipationRequestQueryDtoSchema._output;
