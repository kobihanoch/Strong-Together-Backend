import { sql as drizzleSql } from 'drizzle-orm';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { socialSchema } from '../../../schemas';
import { postVisibility } from '../table';

/** Represents the post interactions value. */
export type PostInteractions = {
  reactionsCount: {
    likesCount: number;
    fireUpCount: number;
    muscleCount: number;
  };
  commentsCount: number;
};

/** Security-invoker projection of an RLS-visible post with author and interaction data. */
export const postExpandedView = socialSchema
  .view('v_post_expanded', {
    id: uuid('id'),
    authorUserId: uuid('author_user_id'),
    workoutSummaryId: uuid('workout_summary_id'),
    content: text('content'),
    visibility: postVisibility('visibility'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    username: text('username'),
    fullName: text('full_name'),
    profilePicPath: text('profile_pic_path'),
    interactions: jsonb('interactions').$type<PostInteractions>(),
  })
  .with({ securityInvoker: true })
  .as(drizzleSql /*sql*/ `
    SELECT
      p.id,
      p.author_user_id,
      p.workout_summary_id,
      p.content,
      p.visibility,
      p.published_at,
      p.updated_at,
      author.username,
      author.name AS full_name,
      author."profilePicPath" AS profile_pic_path,
      JSONB_BUILD_OBJECT(
        'reactionsCount',
        reactions_data.reactions,
        'commentsCount',
        comments_data.comments_count
      ) AS interactions
    FROM
      social.post p
      CROSS JOIN LATERAL identity.get_user_profile (p.author_user_id) author
      CROSS JOIN LATERAL (
        SELECT
          JSONB_BUILD_OBJECT(
            'likesCount',
            COUNT(*) FILTER (
              WHERE
                reaction.type = 'like'
            ),
            'fireUpCount',
            COUNT(*) FILTER (
              WHERE
                reaction.type = 'fire up'
            ),
            'muscleCount',
            COUNT(*) FILTER (
              WHERE
                reaction.type = 'muscle'
            )
          ) AS reactions
        FROM
          social.reaction reaction
        WHERE
          reaction.post_id = p.id
      ) reactions_data
      CROSS JOIN LATERAL (
        SELECT
          COUNT(*) AS comments_count
        FROM
          social.comment post_comment
        WHERE
          post_comment.post_id = p.id
      ) comments_data
  `);
