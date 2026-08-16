import { relations } from 'drizzle-orm';
import { bigint, foreignKey, index, integer, primaryKey, real, unique, uuid } from 'drizzle-orm/pg-core';
import { trackingSchema } from '../../schemas';
import { exerciseTracking } from '../exercisetracking/table';
import { trackingSetPolicies } from './policies';

export const trackingSet = trackingSchema.table(
  'tracking_set',
  {
    id: uuid('id').defaultRandom().notNull(),
    exerciseTrackingId: bigint('exercise_tracking_id', { mode: 'number' }).notNull(),
    setIndex: integer('set_index').notNull(),
    reps: integer('reps').notNull(),
    weight: real('weight').notNull(),
  },
  (t) => [
    primaryKey({ name: 'tracking_set_pkey', columns: [t.id] }),
    unique('tracking_set_exercise_index_unique').on(t.exerciseTrackingId, t.setIndex),
    foreignKey({
      name: 'tracking_set_exercise_tracking_id_fkey',
      columns: [t.exerciseTrackingId],
      foreignColumns: [exerciseTracking.id],
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('tracking_set_exercise_tracking_id_idx').on(t.exerciseTrackingId),
    ...trackingSetPolicies(t),
  ],
);

export const trackingSetRelations = relations(trackingSet, ({ one }) => ({
  exerciseTracking: one(exerciseTracking, {
    fields: [trackingSet.exerciseTrackingId],
    references: [exerciseTracking.id],
  }),
}));
