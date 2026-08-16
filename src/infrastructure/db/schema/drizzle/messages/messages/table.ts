import { relations, sql as drizzleSql } from 'drizzle-orm';
import { boolean, foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from '../../identity/users/table';
import { messagesSchema } from '../../schemas';
import { messagePolicies } from './policies';
const uid = drizzleSql`"identity"."current_user_id"()`;
export const message = messagesSchema.table(
  'message',
  {
    id: uuid('id').defaultRandom().notNull(),
    senderId: uuid('sender_id').default(uid).notNull(),
    receiverId: uuid('receiver_id').default(uid).notNull(),
    subject: text('subject').default('Subject').notNull(),
    msg: text('msg').default('Hello World').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true })
      .default(drizzleSql`(now() AT TIME ZONE 'utc')`)
      .notNull(),
    isRead: boolean('is_read').default(false).notNull(),
  },
  (t) => [
    primaryKey({ name: 'message_pkey', columns: [t.id] }),
    foreignKey({ name: 'message_sender_id_fkey', columns: [t.senderId], foreignColumns: [user.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({ name: 'message_receiver_id_fkey', columns: [t.receiverId], foreignColumns: [user.id] })
      .onUpdate('cascade')
      .onDelete('cascade'),
    index('message_receiver_id_idx').on(t.receiverId),
    ...messagePolicies(t),
  ],
);
export const messageRelations = relations(message, ({ one }) => ({
  sender: one(user, { fields: [message.senderId], references: [user.id], relationName: 'messageSender' }),
  receiver: one(user, { fields: [message.receiverId], references: [user.id], relationName: 'messageReceiver' }),
}));
