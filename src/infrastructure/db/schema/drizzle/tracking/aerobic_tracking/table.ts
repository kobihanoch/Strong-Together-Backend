import { relations, sql as drizzleSql } from 'drizzle-orm';
import { bigint, foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/user/table';
import { trackingSchema } from '../../schemas';
import { aerobicTrackingPolicies } from './policies';

export const aerobicTracking = trackingSchema.table(
  'aerobic_tracking',
  {
    id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity({ name: 'aerobic_tracking_id_seq' }).notNull(),
    userId: uuid('user_id').notNull(),
    type: text('type').notNull(),
    durationSec: bigint('duration_sec', { mode: 'number' }).default(0).notNull(),
    workoutTimeUtc: timestamp('workout_time_utc', { withTimezone: true })
      .default(drizzleSql`(now() AT TIME ZONE 'utc')`)
      .notNull(),
  },
  (t) => [
    primaryKey({ name: 'aerobic_tracking_pkey', columns: [t.id] }),
    foreignKey({ name: 'aerobic_tracking_user_id_fkey', columns: [t.userId], foreignColumns: [user.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('aerobic_tracking_user_id_workout_time_utc_idx').on(t.userId, t.workoutTimeUtc.desc().nullsFirst()),
    ...aerobicTrackingPolicies(t),
  ],
);
export const aerobicTrackingRelations = relations(aerobicTracking, ({ one }) => ({
  user: one(user, { fields: [aerobicTracking.userId], references: [user.id] }),
}));
