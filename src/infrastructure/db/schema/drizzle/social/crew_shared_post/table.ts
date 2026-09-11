import { relations } from 'drizzle-orm';
import { foreignKey, index, primaryKey, unique, uuid } from 'drizzle-orm/pg-core';
import { socialSchema } from '../../schemas';
import { crew } from '../crew/table';
import { post } from '../post/table';
import { crewSharedPostPolicies } from './policies';
export const crewSharedPost = socialSchema
  .table(
    'crew_shared_post',
    { id: uuid('id').defaultRandom().notNull(), crewId: uuid('crew_id').notNull(), postId: uuid('post_id').notNull() },
    (t) => [
      primaryKey({ name: 'crew_shared_post_pkey', columns: [t.id] }),
      foreignKey({ name: 'crew_shared_post_crew_id_fkey', columns: [t.crewId], foreignColumns: [crew.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      foreignKey({ name: 'crew_shared_post_post_id_fkey', columns: [t.postId], foreignColumns: [post.id] })
        .onUpdate('cascade')
        .onDelete('cascade'),
      unique('crew_shared_post_post_id_unique').on(t.postId),
      index('crew_shared_post_crew_id_idx').on(t.crewId),
      ...crewSharedPostPolicies(t),
    ],
  )
  .enableRLS();
export const crewSharedPostRelations = relations(crewSharedPost, ({ one }) => ({
  crew: one(crew, { fields: [crewSharedPost.crewId], references: [crew.id] }),
  post: one(post, { fields: [crewSharedPost.postId], references: [post.id] }),
}));
