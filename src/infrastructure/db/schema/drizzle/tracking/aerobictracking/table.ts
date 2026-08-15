import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../identity/users/table';
import { trackingSchema } from '../../schemas';
import { aerobicTrackingPolicies } from './policies';

export const aerobictracking = trackingSchema.table(
  'aerobictracking',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'aerobictracking_id_seq' }).notNull(),
    userId: uuid('user_id').notNull(),
    type: text('type').notNull(),
    durationMins: bigint('duration_mins', { mode: 'number' }).default(0).notNull(),
    durationSec: bigint('duration_sec', { mode: 'number' }).default(0).notNull(),
    workoutTimeUtc: timestamp('workout_time_utc', { withTimezone: true })
      .default(drizzleSql`now() AT TIME ZONE 'utc'`)
      .notNull(),
  },
  (t) => [
    primaryKey({ name: 'aerobictracking_pkey', columns: [t.id] }),
    foreignKey({ name: 'aerobictracking_user_id_fkey', columns: [t.userId], foreignColumns: [users.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('aerobictracking_user_id_workout_time_utc_idx').on(t.userId, t.workoutTimeUtc.desc()),
    ...aerobicTrackingPolicies(t),
  ],
);
export const aerobictrackingRelations = relations(aerobictracking, ({ one }) => ({
  user: one(users, { fields: [aerobictracking.userId], references: [users.id] }),
}));
