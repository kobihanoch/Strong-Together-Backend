import { relations, sql as drizzleSql } from 'drizzle-orm';
import { boolean, foreignKey, index, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from '../../identity/users/table';
import { messagesSchema } from '../../schemas';
import { messagesPolicies } from './policies';
const uid = drizzleSql`"identity"."current_user_id"()`;
export const messages = messagesSchema.table('messages', { id: uuid('id').defaultRandom().notNull(), senderId: uuid('sender_id').default(uid).notNull(), receiverId: uuid('receiver_id').default(uid).notNull(), subject: text('subject').default('Subject').notNull(), msg: text('msg').default('Hello World').notNull(), sentAt: timestamp('sent_at', { withTimezone: true }).default(drizzleSql`now() AT TIME ZONE 'utc'`).notNull(), isRead: boolean('is_read').default(false).notNull() }, (t) => [primaryKey({ name: 'messages_pkey', columns: [t.id] }), foreignKey({ name: 'messages_sender_id_fkey', columns: [t.senderId], foreignColumns: [users.id] }).onUpdate('cascade').onDelete('cascade'), foreignKey({ name: 'messages_receiver_id_fkey', columns: [t.receiverId], foreignColumns: [users.id] }).onUpdate('cascade').onDelete('cascade'), index('messages_receiver_id_idx').on(t.receiverId), ...messagesPolicies(t)]);
export const messagesRelations = relations(messages, ({ one }) => ({ sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: 'messageSender' }), receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: 'messageReceiver' }) }));
